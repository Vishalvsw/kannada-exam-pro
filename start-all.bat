@echo off
title GK Quiz Platform - 62k Instagram Followers

echo ========================================
echo GK Quiz Platform
echo For 62,000 Instagram Followers
echo ========================================
echo.

REM Start Python Backend
echo Starting Python Backend...
start cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Application Starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000
echo.
echo Application is running!
echo Close both terminal windows to stop.
pause
