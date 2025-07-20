@echo off
echo Starting backend server...
start cmd /k "cd backend && npm start"
timeout /t 5 > nul

echo Opening frontend index.html...
start "" "frontend\index.html"
