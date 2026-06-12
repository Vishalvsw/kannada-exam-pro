'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch(e) {
        console.error('Error parsing user:', e);
      }
    }
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      // Filter ONLY users who have taken tests (score > 0 OR totalQuizzesTaken > 0)
      let allUsers = Array.isArray(data) ? data : [];
      const testTakers = allUsers.filter(user => (user.score || 0) > 0 || (user.totalQuizzesTaken || 0) > 0);
      const sortedUsers = testTakers.sort((a, b) => (b.score || 0) - (a.score || 0));
      setUsers(sortedUsers);
      setTotalParticipants(sortedUsers.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsersByTime = (users, period) => {
    const now = new Date();
    return users.filter(user => {
      if (period === 'all') return true;
      const userDate = new Date(user.lastQuizDate || user.createdAt);
      if (isNaN(userDate.getTime())) return period === 'all';
      const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));
      if (period === 'today') return diffDays === 0;
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      return true;
    });
  };

  const tabs = [
    { id: 'all', label: '🏆 All-Time' },
    { id: 'today', label: '📅 Today' },
    { id: 'week', label: '📆 This Week' },
    { id: 'month', label: '📊 This Month' }
  ];

  const filteredUsers = filterUsersByTime(users, activeTab);
  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topThree = sortedFilteredUsers.slice(0, 3);
  const topTen = sortedFilteredUsers.slice(0, 10);
  const remainingUsers = sortedFilteredUsers.slice(10);
  
  const currentUserRank = sortedFilteredUsers.findIndex(u => {
    const userId = (u.instagramId || u.email || '').toString().toLowerCase();
    const currentId = (currentUser?.instagramId || currentUser?.email || '').toString().toLowerCase();
    return userId === currentId && userId !== '';
  }) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 animate-bounce">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-5xl animate-pulse">🏆</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-purple-100 text-sm mt-1">
                {totalParticipants} Candidates Attempted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-5 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-600">⚠️ {error}</p>
            <button onClick={fetchLeaderboard} className="text-xs text-red-600 underline mt-1">Try Again</button>
          </div>
        </div>
      )}

      {/* Your Rank Card */}
      {currentUser && currentUserRank > 0 && currentUserRank <= sortedFilteredUsers.length && (
        <div className="max-w-4xl mx-auto px-5 mt-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  #{currentUserRank}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Your Rank</p>
                  <p className="font-bold text-gray-800">@{currentUser.instagramId || currentUser.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Your Score</p>
                <p className="text-2xl font-bold text-purple-600">{currentUser.score || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-md p-1 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading leaderboard...</p>
        </div>
      ) : sortedFilteredUsers.length > 0 ? (
        <div className="max-w-4xl mx-auto px-5 py-6">
          {/* Top 3 Podium */}
          {topThree.length >= 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-center text-sm font-bold text-gray-600 mb-6">🏆 Top Performers 🏆</h3>
              <div className="flex justify-center items-end gap-2 flex-wrap">
                {topThree[1] && (
                  <div className="text-center w-28">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl ring-2 ring-gray-400 shadow-md">🥈</div>
                    <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[1]?.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">@{topThree[1]?.instagramId}</p>
                    <p className="text-xl font-bold text-gray-700 mt-1">{topThree[1]?.score || 0}</p>
                    <div className="mt-2 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg w-full"></div>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">2nd Place</p>
                  </div>
                )}
                {topThree[0] && (
                  <div className="text-center w-32 -mt-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl ring-4 ring-yellow-400 shadow-lg animate-pulse">👑</div>
                    <p className="font-bold text-gray-800 text-base mt-2 truncate">{topThree[0]?.name || 'Champion'}</p>
                    <p className="text-xs text-gray-500 truncate">@{topThree[0]?.instagramId}</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{topThree[0]?.score || 0}</p>
                    <div className="mt-2 h-20 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg w-full"></div>
                    <p className="text-xs text-yellow-600 font-bold mt-1">🏆 CHAMPION 🏆</p>
                  </div>
                )}
                {topThree[2] && (
                  <div className="text-center w-28">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl ring-2 ring-orange-500 shadow-md">🥉</div>
                    <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[2]?.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">@{topThree[2]?.instagramId}</p>
                    <p className="text-xl font-bold text-orange-600 mt-1">{topThree[2]?.score || 0}</p>
                    <div className="mt-2 h-12 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg w-full"></div>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">3rd Place</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top 10 List */}
          {topTen.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-3">
                <div className="flex items-center justify-between text-white text-sm font-semibold">
                  <div className="flex items-center gap-4"><span>#</span><span>Top 10 Rankers</span></div>
                  <span>Score</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {topTen.map((user, idx) => {
                  const rank = idx + 1;
                  const isCurrentUser = (user.instagramId || user.email || '').toLowerCase() === (currentUser?.instagramId || currentUser?.email || '').toLowerCase();
                  return (
                    <div key={user._id || idx} className={`px-5 py-3 flex items-center justify-between transition-all ${isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${
                          rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-500' : rank === 3 ? 'bg-orange-500' : 'bg-purple-500'
                        }`}>{rank}</div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name || 'Anonymous'}{isCurrentUser && <span className="ml-1 text-xs text-purple-600 font-bold">(You)</span>}</p>
                          <p className="text-xs text-gray-400">@{user.instagramId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{user.score || 0}</p>
                        <p className="text-[10px] text-gray-400">{user.totalQuizzesTaken || 0} quizzes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View All - Remaining Users */}
          {remainingUsers.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-gray-200 transition">
                <span>📋</span> View All ({remainingUsers.length} more)
                <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden">
                {remainingUsers.map((user, idx) => {
                  const rank = idx + 11;
                  const isCurrentUser = (user.instagramId || user.email || '').toLowerCase() === (currentUser?.instagramId || currentUser?.email || '').toLowerCase();
                  return (
                    <div key={user._id || idx} className={`px-4 py-2 flex items-center justify-between border-b border-gray-100 last:border-0 ${isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">{rank}</div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{user.name || 'Anonymous'}{isCurrentUser && <span className="ml-1 text-xs text-purple-600">(You)</span>}</p>
                          <p className="text-xs text-gray-400">@{user.instagramId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{user.score || 0}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-5 py-12">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Rankings Yet</h3>
            <p className="text-gray-500 text-sm">Be the first to take a quiz and appear on the leaderboard!</p>
            <Link href="/quiz">
              <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                Take First Quiz →
              </button>
            </Link>
          </div>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation - No refresh/update button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-purple-600">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
