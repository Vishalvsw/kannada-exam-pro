'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import { LeaderboardSkeleton } from '@/components/Skeleton';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch(e) {}
    }
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?_=${Date.now()}`);
      const data = await res.json();
      const usersWithScores = (Array.isArray(data) ? data : []).filter(u => (u.score || 0) > 0);
      setUsers(usersWithScores.sort((a, b) => (b.score || 0) - (a.score || 0)));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LeaderboardSkeleton />;

  const topThree = users.slice(0, 3);
  const topTen = users.slice(0, 10);
  const remaining = users.slice(10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-purple-100 text-xs mt-1">{users.length} Active Participants</p>
          <button onClick={fetchLeaderboard} className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">🔄 Refresh</button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No rankings yet. Take a quiz to appear!</p>
          <Link href="/quiz"><button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">Take Quiz →</button></Link>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="max-w-md mx-auto px-4 mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-center items-end gap-2">
                  {topThree[1] && (
                    <div className="text-center w-24">
                      <div className="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-3xl">🥈</div>
                      <p className="font-bold text-sm mt-2 truncate">{topThree[1]?.name?.split(' ')[0]}</p>
                      <p className="text-xl font-bold">{topThree[1]?.score}</p>
                    </div>
                  )}
                  {topThree[0] && (
                    <div className="text-center w-28 -mt-6">
                      <div className="w-20 h-20 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-4xl animate-pulse">👑</div>
                      <p className="font-bold text-base mt-2 truncate">{topThree[0]?.name}</p>
                      <p className="text-2xl font-bold text-yellow-600">{topThree[0]?.score}</p>
                    </div>
                  )}
                  {topThree[2] && (
                    <div className="text-center w-24">
                      <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-3xl">🥉</div>
                      <p className="font-bold text-sm mt-2 truncate">{topThree[2]?.name?.split(' ')[0]}</p>
                      <p className="text-xl font-bold">{topThree[2]?.score}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Top 10 List */}
          <div className="max-w-md mx-auto px-4 mt-6">
            <h2 className="font-bold mb-3">⭐ Top 10 Rankers</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {topTen.map((user, idx) => (
                <div key={user._id} className="px-4 py-3 flex justify-between border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">{idx+1}</div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">@{user.instagramId}</p>
                    </div>
                  </div>
                  <p className="font-bold text-purple-600">{user.score}</p>
                </div>
              ))}
            </div>
          </div>

          {/* View All */}
          {remaining.length > 0 && (
            <details className="max-w-md mx-auto px-4 mt-4 mb-20">
              <summary className="text-sm text-gray-500 cursor-pointer">📋 View All ({remaining.length} more)</summary>
              <div className="mt-2 bg-white rounded-xl shadow-lg">
                {remaining.map((user, idx) => (
                  <div key={user._id} className="px-4 py-2 flex justify-between border-b">
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-400">#{idx+11}</span>
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{user.score}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500"><span className="text-xl">🏠</span><span className="text-xs">Home</span></Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500"><span className="text-xl">🎯</span><span className="text-xs">Quiz</span></Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500"><span className="text-xl">📖</span><span className="text-xs">Study</span></Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500"><span className="text-xl">📰</span><span className="text-xs">Current</span></Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-purple-600"><span className="text-xl">🏆</span><span className="text-xs">Rank</span></Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500"><span className="text-xl">👤</span><span className="text-xs">Profile</span></Link>
        </div>
      </div>
    </div>
  );
}
