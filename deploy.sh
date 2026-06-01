#!/bin/bash

echo "🚀 Deploying GK Quiz Platform for 62k Instagram Followers"
echo "========================================================"

# Start backend
echo "📦 Starting Python Backend..."
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
cd ..

# Start frontend
echo "🎨 Starting Next.js Frontend..."
npm run dev

echo "✅ Application running at http://localhost:3000"
echo "📊 API running at http://localhost:8000"
