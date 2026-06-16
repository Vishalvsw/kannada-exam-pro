'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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
    
    // Load cached data instantly
    const cachedLeaderboard = localStorage.getItem('cachedLeaderboard');
    if (cachedLeaderboard) {
      try {
        const cached = JSON.parse(cachedLeaderboard);
        setUsers(cached.users || []);
        setLastUpdated(cached.timestamp ? new Date(cached.timestamp) : null);
        setLoading(false);
      } catch(e) {}
    }
    
    fetchLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/leaderboard?t=${timestamp}`);
      const data = await response.json();
      
      let allUsers = [];
      if (Array.isArray(data)) {
        allUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        allUsers = data.users;
      }
      
      // Filter users with score > 0 and sort by score
      const usersWithScores = allUsers.filter(user => (user.score || 0) > 0);
      const sortedUsers = usersWithScores.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      // SHOW ONLY TOP 100 USERS
      const top100Users = sortedUsers.slice(0, 100);
      
      setUsers(top100Users);
      setLastUpdated(new Date());
      setError(null);
      
      localStorage.setItem('cachedLeaderboard', JSON.stringify({
        users: top100Users,
        timestamp: Date.now()
      }));

      // Update current user's latest data
      if (currentUser) {
        const updatedUser = top100Users.find(u => 
          (u.instagramId || '').toLowerCase() === (currentUser.instagramId || '').toLowerCase()
        );
        if (updatedUser) {
          const mergedUser = { ...currentUser, ...updatedUser };
          localStorage.setItem('user', JSON.stringify(mergedUser));
          setCurrentUser(mergedUser);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (!silent) setError(error.message);
    } finally {
      if (!silent) setRefreshing(false);
      setLoading(false);
    }
  };

  const filterUsersByTime = (users, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return users.filter(user => {
      if (period === 'all') return true;
      
      let userDate = null;
      if (user.lastQuizDate) {
        userDate = new Date(user.lastQuizDate);
      } else if (user.updatedAt) {
        userDate = new Date(user.updatedAt);
      } else if (user.createdAt) {
        userDate = new Date(user.createdAt);
      }
      
      if (!userDate || isNaN(userDate.getTime())) {
        return period === 'all';
      }
      
      const userDay = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
      const diffDays = Math.floor((today - userDay) / (1000 * 60 * 60 * 24));
      
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
  const remainingUsers = sortedFilteredUsers.slice(10, 100);
  
  // Find current user's rank more reliably
  let currentUserRank = -1;
  let currentUserScore = 0;
  
  if (currentUser) {
    const currentUserId = (currentUser.instagramId || '').toString().toLowerCase();
    
    // Find user in sorted list
    const foundIndex = sortedFilteredUsers.findIndex(u => {
      const userId = (u.instagramId || '').toString().toLowerCase();
      return userId === currentUserId && userId !== '';
    });
    
    if (foundIndex !== -1) {
      currentUserRank = foundIndex + 1;
      currentUserScore = sortedFilteredUsers[foundIndex].score || 0;
    } else {
      // User not in top 100, try to find in full list or use stored score
      currentUserScore = currentUser.score || 0;
      // Try to find in full users list from API
      // We'll keep rank as -1 to show "Not in top 100"
    }
  }

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-purple-200 mt-1">See how you rank against others!</p>
          {lastUpdated && (
            <p className="text-[10px] text-purple-300 mt-2 opacity-75">
              Updated {formatTime(lastUpdated)}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-600">⚠️ {error}</p>
            <button onClick={() => fetchLeaderboard(false)} className="text-xs text-red-600 underline mt-1">Try Again</button>
          </div>
        </div>
      )}

      {/* Your Rank Card - Fixed */}
      {currentUser && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className={`rounded-xl p-4 border-2 shadow-lg ${
            currentUserRank > 0 && currentUserRank <= 100
              ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                  currentUserRank === 1 ? 'bg-yellow-500' :
                  currentUserRank === 2 ? 'bg-gray-500' :
                  currentUserRank === 3 ? 'bg-orange-500' :
                  currentUserRank > 0 ? 'bg-purple-600' :
                  'bg-gray-400'
                }`}>
                  {currentUserRank > 0 ? `#${currentUserRank}` : '—'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Your Rank</p>
                  <p className="font-bold text-gray-800">
                    @{currentUser.instagramId || currentUser.name || 'User'}
                  </p>
                  {currentUserRank > 100 || currentUserRank === -1 ? (
                    <p className="text-[10px] text-gray-400">Not in Top 100</p>
                  ) : currentUserRank <= 100 && (
                    <p className="text-[10px] text-purple-600 font-medium">
                      Top {currentUserRank <= 10 ? '10' : currentUserRank <= 25 ? '25' : '100'} Ranker!
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500">Your Score</p>
                <p className="text-3xl font-bold text-purple-600">{currentUserScore || currentUser.score || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 1 && (
        <div className="max-w-md mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-center text-sm font-bold text-gray-600 mb-6">🏆 Top Performers 🏆</h3>
            <div className="flex justify-center items-end gap-2">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="text-center w-24">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl ring-2 ring-gray-400 shadow-md">🥈</div>
                  <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[1]?.name?.split(' ')[0] || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">@{topThree[1]?.instagramId}</p>
                  <p className="text-xl font-bold text-gray-700 mt-1">{topThree[1]?.score || 0}</p>
                  <div className="mt-2 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg w-full"></div>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">2nd Place</p>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="text-center w-28 -mt-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl ring-4 ring-yellow-400 shadow-lg animate-pulse">👑</div>
                  <p className="font-bold text-gray-800 text-base mt-2 truncate">{topThree[0]?.name || 'Champion'}</p>
                  <p className="text-xs text-gray-500 truncate">@{topThree[0]?.instagramId}</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{topThree[0]?.score || 0}</p>
                  <div className="mt-2 h-20 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg w-full"></div>
                  <p className="text-xs text-yellow-600 font-bold mt-1">🏆 CHAMPION 🏆</p>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="text-center w-24">
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
        </div>
      )}

      {/* Top 10 List */}
      {topTen.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-purple-600">⭐</span> Top 10 Rankers
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {topTen.map((user, idx) => {
              const rank = idx + 1;
              const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
              return (
                <div key={user._id || idx} className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-0 transition-all ${isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-500' : rank === 3 ? 'bg-orange-500' : 'bg-purple-500'}`}>{rank}</div>
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

      {/* View More Rankers (Ranks 11-100) */}
      {remainingUsers.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6 mb-20">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-gray-200 transition">
              <span>📋</span> View More Rankers ({remainingUsers.length} of Top 100)
              <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden">
              {remainingUsers.map((user, idx) => {
                const rank = idx + 11;
                const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
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
        </div>
      )}

      {/* Empty State */}
      {sortedFilteredUsers.length === 0 && !error && (
        <div className="max-w-md mx-auto px-4 mt-12 text-center">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-gray-600 font-medium">No rankings yet for this period</p>
          <p className="text-xs text-gray-400 mt-1">Take a quiz to appear on leaderboard!</p>
          <Link href="/quiz">
            <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
              Take First Quiz →
            </button>
          </Link>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🎯</span><span className="text-xs">Test</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-purple-600">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
