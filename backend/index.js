import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "postgres",
  password: process.env.PGPASSWORD || "password",
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});
app.get("/", (req, res) => {
  res.send("Bible Backend is running!");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const bookAbbr = {
  gen: "Genesis",
  exo: "Exodus",
  lev: "Leviticus",
  num: "Numbers",
  deu: "Deuteronomy",
  jos: "Joshua",
  jdg: "Judges",
  rut: "Ruth",
  "1sa": "1 Samuel",
  "2sa": "2 Samuel",
  "1ki": "1 Kings",
  "2ki": "2 Kings",
  "1ch": "1 Chronicles",
  "2ch": "2 Chronicles",
  ezr: "Ezra",
  neh: "Nehemiah",
  est: "Esther",
  job: "Job",
  psa: "Psalm",
  pro: "Proverbs",
  ecc: "Ecclesiastes",
  sol: "Song Of Solomon",
  isa: "Isaiah",
  jer: "Jeremiah",
  lam: "Lamentations",
  eze: "Ezekiel",
  dan: "Daniel",
  hos: "Hosea",
  joe: "Joel",
  amo: "Amos",
  oba: "Obadiah",
  jon: "Jonah",
  mic: "Micah",
  nah: "Nahum",
  hab: "Habakkuk",
  zep: "Zephaniah",
  hag: "Haggai",
  zec: "Zechariah",
  mal: "Malachi",
  mat: "Matthew",
  mar: "Mark",
  luk: "Luke",
  joh: "John",
  act: "Acts",
  rom: "Romans",
  "1co": "1 Corinthians",
  "2co": "2 Corinthians",
  gal: "Galatians",
  eph: "Ephesians",
  phi: "Philippians",
  col: "Colossians",
  "1th": "1 Thessalonians",
  "2th": "2 Thessalonians",
  "1ti": "1 Timothy",
  "2ti": "2 Timothy",
  tit: "Titus",
  phm: "Philemon",
  heb: "Hebrews",
  jam: "James",
  "1pe": "1 Peter",
  "2pe": "2 Peter",
  "1jo": "1 John",
  "2jo": "2 John",
  "3jo": "3 John",
  jud: "Jude",
  rev: "Revelation",
};

app.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "No query provided." });
  }
  // Remove all whitespace and lowercase
  const cleaned = q.replace(/\s+/g, "").toLowerCase();

  // Extract book abbreviation, chapter, and verse or verse range
  // Examples: 1gen3.1, 1gen3.1-3
  const match = cleaned.match(/^([1-3]?[a-z]+)(\d+)\.(\d+)(?:-(\d+))?$/);
  if (!match) {
    return res
      .status(400)
      .json({ error: "Invalid query format. Use e.g. gen1.1 or 1cor13.4-7" });
  }
  const abbr = match[1];
  const book = bookAbbr[abbr];
  if (!book) {
    return res.status(400).json({ error: "Unknown book abbreviation." });
  }
  const chapter = parseInt(match[2]);
  const verseStart = parseInt(match[3]);
  const verseEnd = match[4] ? parseInt(match[4]) : verseStart;

  let sql =
    "SELECT * FROM nkjv WHERE book = $1 AND chapter = $2 AND verse >= $3 AND verse <= $4 ORDER BY verse ASC";
  let params = [book, chapter, verseStart, verseEnd];

  try {
    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No results found." });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
