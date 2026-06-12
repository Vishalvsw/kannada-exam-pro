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
  const [addingDemo, setAddingDemo] = useState(false);

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
    const interval = setInterval(() => fetchLeaderboard(), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      let allUsers = Array.isArray(data) ? data : (data.users && Array.isArray(data.users) ? data.users : []);
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

  const addDemoUser = async () => {
    setAddingDemo(true);
    try {
      const demoUsers = [
        { name: "Rahul Sharma", instagramId: "rahul_sharma", score: 1250, totalQuizzesTaken: 15 },
        { name: "Priya Patel", instagramId: "priya_patel", score: 1180, totalQuizzesTaken: 12 },
        { name: "Amit Kumar", instagramId: "amit_kumar", score: 1090, totalQuizzesTaken: 10 },
        { name: "Sneha Reddy", instagramId: "sneha_r", score: 980, totalQuizzesTaken: 9 },
        { name: "Vikram Singh", instagramId: "vikram_s", score: 850, totalQuizzesTaken: 8 },
        { name: "Kavya Joshi", instagramId: "kavya_j", score: 720, totalQuizzesTaken: 7 },
        { name: "Manjunath K", instagramId: "manju_k", score: 650, totalQuizzesTaken: 6 },
        { name: "Anusha S", instagramId: "anusha_s", score: 580, totalQuizzesTaken: 5 },
      ];
      
      for (const user of demoUsers) {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      }
      
      await fetchLeaderboard();
      alert('Demo users added successfully!');
    } catch (error) {
      console.error('Error adding demo users:', error);
      alert('Error adding demo users');
    } finally {
      setAddingDemo(false);
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
  const remainingUsers = sortedFilteredUsers.slice(3);
  
  const currentUserRank = sortedFilteredUsers.findIndex(u => {
    const userId = (u.instagramId || u.email || '').toString().toLowerCase();
    const currentId = (currentUser?.instagramId || currentUser?.email || '').toString().toLowerCase();
    return userId === currentId && userId !== '';
  }) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header - Green Theme */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 animate-bounce">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-5xl animate-pulse">🏆</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-green-100 text-sm mt-1">
                {totalParticipants} Active Participants
                {lastUpdated && <span> · Updated {lastUpdated.toLocaleTimeString()}</span>}
              </p>
              <div className="flex gap-2 justify-center mt-2">
                <button onClick={() => fetchLeaderboard()} className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                  🔄 Refresh Now
                </button>
                {totalParticipants === 0 && (
                  <button onClick={addDemoUser} disabled={addingDemo} className="text-xs bg-yellow-500/80 px-3 py-1 rounded-full hover:bg-yellow-500 transition">
                    {addingDemo ? 'Adding...' : '➕ Add Demo Users'}
                  </button>
                )}
              </div>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  #{currentUserRank}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Your Rank</p>
                  <p className="font-bold text-gray-800">@{currentUser.instagramId || currentUser.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Your Score</p>
                <p className="text-2xl font-bold text-green-600">{currentUser.score || 0}</p>
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
                activeTab === tab.id ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
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

          {/* Users List */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3">
              <div className="flex items-center justify-between text-white text-sm font-semibold">
                <div className="flex items-center gap-4"><span>#</span><span>User</span></div>
                <span>Score</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {remainingUsers.map((user, idx) => {
                const rank = idx + 4;
                const isCurrentUser = (user.instagramId || user.email || '').toLowerCase() === (currentUser?.instagramId || currentUser?.email || '').toLowerCase();
                return (
                  <div key={user._id || idx} className={`px-5 py-3 flex items-center justify-between transition-all ${isCurrentUser ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs shadow-md">{rank}</div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.name || 'Anonymous'}{isCurrentUser && <span className="ml-1 text-xs text-green-600 font-bold">(You)</span>}</p>
                        <p className="text-xs text-gray-400">@{user.instagramId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{user.score || 0}</p>
                      <p className="text-[10px] text-gray-400">{user.totalQuizzesTaken || 0} quizzes</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-5 py-12">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Rankings Yet</h3>
            <p className="text-gray-500 text-sm">Be the first to take a quiz and appear on the leaderboard!</p>
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/quiz">
                <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                  Take First Quiz →
                </button>
              </Link>
              <button 
                onClick={addDemoUser} 
                disabled={addingDemo}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
              >
                {addingDemo ? 'Adding...' : '📊 Add Demo Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span></Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📖</span><span className="text-[10px]">Study</span></Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📰</span><span className="text-[10px]">Current</span></Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-green-600"><span className="text-xl">🏆</span><span className="text-[10px]">Rank</span></Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">👤</span><span className="text-[10px]">Profile</span></Link>
        </div>
      </div>
    </div>
  );
}
