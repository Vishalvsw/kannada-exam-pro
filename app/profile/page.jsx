'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdSpace from '@/components/AdSpace';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    score: 0,
    totalQuizzesTaken: 0,
    rank: 0,
    correctAnswers: 0,
    totalQuestions: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedInstagram, setEditedInstagram] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setEditedName(userData.name || '');
      setEditedInstagram(userData.instagramId || '');
      fetchUserStats(userData);
    } catch(e) {
      console.error('Error parsing user:', e);
      router.push('/login');
    }
  }, [router]);

  const fetchUserStats = async (userData) => {
    try {
      // Fetch leaderboard to get user rank
      const response = await fetch('/api/leaderboard');
      const users = await response.json();
      
      // Find user in leaderboard
      const userInLeaderboard = users.find(u => 
        u.instagramId === userData.instagramId || u.email === userData.email
      );
      
      // Calculate rank
      const sortedUsers = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));
      const rank = sortedUsers.findIndex(u => 
        u.instagramId === userData.instagramId || u.email === userData.email
      ) + 1;
      
      setUserStats({
        score: userInLeaderboard?.score || userData.score || 0,
        totalQuizzesTaken: userInLeaderboard?.totalQuizzesTaken || userData.totalQuizzesTaken || 0,
        rank: rank > 0 ? rank : 'Unranked',
        correctAnswers: userInLeaderboard?.correctAnswers || 0,
        totalQuestions: userInLeaderboard?.totalQuestions || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          name: editedName,
          instagramId: editedInstagram
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, name: editedName, instagramId: editedInstagram };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        fetchUserStats(updatedUser);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mx-auto">
              <span className="text-5xl">👤</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-green-100 text-sm mt-1">Manage your account</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-24"></div>
          
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-4xl text-white">
                {user.name?.charAt(0) || '👤'}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center px-6 pb-6">
            {editing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-xl font-bold"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={editedInstagram}
                  onChange={(e) => setEditedInstagram(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-gray-600"
                  placeholder="Instagram ID"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditedName(user.name);
                      setEditedInstagram(user.instagramId);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">@{user.instagramId}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 text-green-600 text-sm hover:text-green-700 transition"
                >
                  ✏️ Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xs text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-yellow-600">{userStats.score}</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">📝</div>
            <p className="text-xs text-gray-500">Quizzes Taken</p>
            <p className="text-2xl font-bold text-blue-600">{userStats.totalQuizzesTaken}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-500">Global Rank</p>
            <p className="text-2xl font-bold text-purple-600">#{userStats.rank}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <p className="text-xs text-gray-500">Accuracy</p>
            <p className="text-2xl font-bold text-green-600">
              {userStats.totalQuestions > 0 
                ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
                : 0}%
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3">
            <h3 className="text-white font-semibold">Recent Activity</h3>
          </div>
          <div className="p-5">
            {userStats.totalQuizzesTaken > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <span className="text-sm text-gray-600">Total Quizzes</span>
                  </div>
                  <span className="font-semibold text-green-600">{userStats.totalQuizzesTaken}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-sm text-gray-600">Total Score</span>
                  </div>
                  <span className="font-semibold text-green-600">{userStats.score}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span className="text-sm text-gray-600">Average Score</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {userStats.totalQuizzesTaken > 0 
                      ? Math.round(userStats.score / userStats.totalQuizzesTaken) 
                      : 0}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No quizzes taken yet</p>
                <Link href="/quiz">
                  <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                    Take Your First Quiz →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Link href="/quiz" className="flex-1">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
              🎯 Take Quiz
            </button>
          </Link>
          <Link href="/leaderboard" className="flex-1">
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
              🏆 View Leaderboard
            </button>
          </Link>
        </div>

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-green-600">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
