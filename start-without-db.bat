@echo off
echo ========================================
echo GK Quiz Platform - Starting Without MongoDB
echo ========================================
echo.
echo This app uses Python backend for data
echo Make sure to start Python backend first:
echo.
echo 1. Open new terminal
echo 2. cd backend
echo 3. pip install -r requirements.txt
echo 4. uvicorn main:app --reload --port 8000
echo.
echo ========================================
echo Starting Frontend...
echo ========================================

npm run dev
pause
