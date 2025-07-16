import json
import re

# Load the mapping from bibles.json
with open('bibles.json', encoding='utf-8') as f:
    books = json.load(f)

# Create a mapping from index to (en, hi)
index_to_names = {book['index']: (book['en'], book['hi']) for book in books}

# Read your SQL file
with open('hindi_bible.sql', encoding='utf-8') as f:
    lines = f.readlines()

output_lines = []
for line in lines:
    # Match lines like VALUES(0, or VALUES(12,
    match = re.match(r'(.*VALUES\()\s*(\d+)\s*,', line)
    if match:
        idx = int(match.group(2))
        if idx in index_to_names:
            en, hi = index_to_names[idx]
            # Replace the index with "en","hi"
            new_line = re.sub(r'VALUES\(\s*\d+\s*,', f'VALUES("{en}","{hi}",', line, count=1)
            output_lines.append(new_line)
            continue
    output_lines.append(line)

# Write the output to a new file
with open('hindi_bible_replaced.sql', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("Replacement complete. Output written to hindi_bible_replaced.sql")