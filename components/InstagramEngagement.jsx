'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function InstagramEngagement() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">📸</div>
        <h3 className="text-xl font-bold">Instagram Community</h3>
        <p className="text-sm opacity-90">62,000+ Followers Strong!</p>
      </div>
      
      {!loading && analytics && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-xs opacity-90">Daily Active</p>
            <p className="text-2xl font-bold">{analytics.daily_active_users || 0}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-xs opacity-90">Engagement</p>
            <p className="text-2xl font-bold">{analytics.engagement_rate || 0}%</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-xs opacity-90">Total Users</p>
            <p className="text-2xl font-bold">{analytics.total_users || 0}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-xs opacity-90">Quizzes Taken</p>
            <p className="text-2xl font-bold">{analytics.total_quizzes_taken || 0}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-xs opacity-80">Join our Instagram family! 📸</p>
        <div className="flex justify-center gap-2 mt-2">
          <span className="text-2xl">❤️</span>
          <span className="text-2xl">👍</span>
          <span className="text-2xl">📸</span>
          <span className="text-2xl">🎯</span>
        </div>
      </div>
    </div>
  );
}
