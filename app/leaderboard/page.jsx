'use client';

import { useState, useEffect, useCallback } from 'react';
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
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch(e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Initial fetch
    fetchLeaderboard();
    
    // Refresh every 3 seconds for real-time updates
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle response data
      let allUsers = [];
      if (Array.isArray(data)) {
        allUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        allUsers = data.users;
      } else {
        allUsers = [];
      }
      
      // Sort by score (highest first)
      const sortedUsers = allUsers.sort((a, b) => (b.score || 0) - (a.score || 0));
      
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
    { id: 'all', label: '🏆 All-Time', icon: '🏆' },
    { id: 'today', label: '📅 Today', icon: '📅' },
    { id: 'week', label: '📆 This Week', icon: '📆' },
    { id: 'month', label: '📊 This Month', icon: '📊' }
  ];

  const filteredUsers = filterUsersByTime(users, activeTab);
  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topThree = sortedFilteredUsers.slice(0, 3);
  const topTen = sortedFilteredUsers.slice(0, 10);
  const remainingUsers = sortedFilteredUsers.slice(10);
  
  const currentUserRank = sortedFilteredUsers.findIndex(u => {
    const userId = (u.instagramId || '').toString().toLowerCase();
    const currentId = (currentUser?.instagramId || '').toString().toLowerCase();
    return userId === currentId;
  }) + 1;

  // Manual refresh
  const handleManualRefresh = () => {
    setLoading(true);
    fetchLeaderboard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-purple-100 text-xs mt-1">
            {totalParticipants} Active Participants
            {lastUpdated && <span> · Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
          <button 
            onClick={handleManualRefresh}
            className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-600">⚠️ {error}</p>
            <button onClick={fetchLeaderboard} className="text-xs text-red-600 underline mt-1">Try Again</button>
          </div>
        </div>
      )}

      {/* Your Rank Card */}
      {currentUser && currentUserRank > 0 && currentUserRank <= sortedFilteredUsers.length && (
        <div className="max-w-md mx-auto px-4 mt-4">
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
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {!loading && topThree.length >= 3 && (
        <div className="max-w-md mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-center text-sm font-bold text-gray-600 mb-6">🏆 Top Performers 🏆</h3>
            <div className="flex justify-center items-end gap-2">
              {/* 2nd Place */}
              <div className="text-center w-24">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl ring-2 ring-gray-400 shadow-md">
                    🥈
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[1]?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[1]?.instagramId}</p>
                <p className="text-xl font-bold text-gray-700 mt-1">{topThree[1]?.score || 0}</p>
                <div className="mt-2 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-gray-400 mt-1 font-semibold">2nd Place</p>
              </div>

              {/* 1st Place */}
              <div className="text-center w-28 -mt-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl ring-4 ring-yellow-400 shadow-lg animate-pulse">
                    👑
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-base mt-2 truncate">{topThree[0]?.name || 'Champion'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[0]?.instagramId}</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{topThree[0]?.score || 0}</p>
                <div className="mt-2 h-20 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-yellow-600 font-bold mt-1">🏆 CHAMPION 🏆</p>
              </div>

              {/* 3rd Place */}
              <div className="text-center w-24">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl ring-2 ring-orange-500 shadow-md">
                    🥉
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[2]?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[2]?.instagramId}</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{topThree[2]?.score || 0}</p>
                <div className="mt-2 h-12 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-gray-400 mt-1 font-semibold">3rd Place</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 List */}
      {!loading && topTen.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-purple-600">⭐</span> Top 10 Rankers
            <span className="text-xs text-gray-400 font-normal">({topTen.length} of {totalParticipants})</span>
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {topTen.map((user, idx) => {
              const rank = idx + 1;
              const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
              return (
                <div 
                  key={user._id || idx} 
                  className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-0 transition-all ${
                    isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                      rank === 1 ? 'bg-yellow-500' : 
                      rank === 2 ? 'bg-gray-500' : 
                      rank === 3 ? 'bg-orange-500' : 
                      'bg-purple-500'
                    }`}>
                      {rank}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.name || 'Anonymous'}
                        {isCurrentUser && <span className="ml-1 text-xs text-purple-600 font-bold">(You)</span>}
                      </p>
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

      {/* Remaining Users */}
      {!loading && remainingUsers.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6 mb-20">
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
                const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
                return (
                  <div 
                    key={user._id || idx} 
                    className={`px-4 py-2 flex items-center justify-between border-b border-gray-100 last:border-0 ${
                      isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 text-sm">
                          {user.name || 'Anonymous'}
                          {isCurrentUser && <span className="ml-1 text-xs text-purple-600">(You)</span>}
                        </p>
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

      {loading && (
        <div className="max-w-md mx-auto px-4 mt-6 text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading leaderboard...</p>
        </div>
      )}

      {!loading && sortedFilteredUsers.length === 0 && !error && (
        <div className="max-w-md mx-auto px-4 mt-12 text-center">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-gray-600 font-medium">No rankings yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to take a quiz!</p>
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
