'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstagramPopup({ user, onComplete }) {
  const router = useRouter();
  const [instagramId, setInstagramId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!instagramId) {
      setError('Please enter your Instagram ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const cleanId = instagramId.replace('@', '');
    
    // Update user with Instagram ID
    const updatedUser = {
      ...user,
      instagramId: cleanId,
      instagramUsername: cleanId,
      instagramVerified: true
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('instagramId', cleanId);
    
    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser;
    } else {
      existingUsers.push(updatedUser);
    }
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete(cleanId);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3 animate-bounce">📸</div>
          <h2 className="text-2xl font-bold text-gray-800">Instagram ID Required</h2>
          <p className="text-gray-600 text-sm mt-2">
            Please enter your Instagram ID to continue and win prizes!
          </p>
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
            <p className="text-xs text-gray-500 mt-1">
              This will be used to identify winners and distribute prizes
            </p>
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
              'Continue to Quiz'
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            🔒 Your Instagram ID is required to verify winners and send prizes
          </p>
        </div>
      </div>
    </div>
  );
}
