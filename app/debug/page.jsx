'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    const [usersRes, resultsRes, questionsRes] = await Promise.all([
      fetch('/api/leaderboard'),
      fetch('/api/quiz-results'),
      fetch('/api/questions')
    ]);
    
    const users = await usersRes.json();
    const results = await resultsRes.json();
    const questions = await questionsRes.json();
    
    setStats({
      users: users.length,
      results: results.length,
      questions: questions.length
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔧 Data Persistence Debug</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <p className="text-gray-500">Users in Leaderboard</p>
            <p className="text-3xl font-bold text-blue-600">{stats.users || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <p className="text-gray-500">Quiz Results</p>
            <p className="text-3xl font-bold text-green-600">{stats.results || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <p className="text-gray-500">Questions Available</p>
            <p className="text-3xl font-bold text-purple-600">{stats.questions || 0}</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="font-bold text-yellow-800 mb-2">⚠️ Important Note</h2>
          <p className="text-yellow-700 text-sm">
            Data is stored in server memory. It will reset when the server restarts.
            For permanent storage, you need to add a database (MongoDB).
          </p>
        </div>
      </div>
    </div>
  );
}
