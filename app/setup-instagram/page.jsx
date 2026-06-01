'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SetupInstagramPage() {
  const router = useRouter();
  const [instagramId, setInstagramId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get temp user from localStorage
    const tempUser = localStorage.getItem('tempUser');
    const existingUser = localStorage.getItem('user');
    
    if (existingUser) {
      router.push('/');
      return;
    }
    
    if (!tempUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(tempUser));
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!instagramId) {
      setError('Instagram ID is required to continue');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const cleanId = instagramId.replace('@', '');
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    
    // Complete user profile with Instagram ID
    const finalUser = {
      id: tempUser.id || Date.now().toString(),
      name: tempUser.name,
      email: tempUser.email,
      picture: tempUser.picture,
      instagramId: cleanId,
      instagramUsername: cleanId,
      profileImage: tempUser.picture || `https://ui-avatars.com/api/?name=${cleanId}&background=3B82F6&color=fff&size=100`,
      role: 'user',
      score: 0,
      totalQuizzesTaken: 0,
      loginMethod: 'google',
      instagramVerified: true,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(finalUser));
    localStorage.setItem('token', 'user-token-' + Date.now());
    localStorage.removeItem('tempUser');
    
    // Save to users list for leaderboard
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(u => u.instagramId === cleanId);
    if (!userExists) {
      existingUsers.push(finalUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
    }
    
    // Also save to admin users API
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalUser)
    }).catch(console.error);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-bounce">📸</div>
            <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
            <p className="text-gray-600 text-sm mt-2">Instagram ID is required to continue</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <img src={user.picture} className="w-12 h-12 rounded-full" alt={user.name} />
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">@</span>
                <input
                  type="text"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value.replace('@', ''))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="username"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter your Instagram username (without @)</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Continue to Quiz Platform'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
