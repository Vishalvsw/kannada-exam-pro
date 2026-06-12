'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairsPage() {
  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentAffairs();
  }, [selectedDate]);

  const fetchCurrentAffairs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/current-affairs');
      const data = await response.json();
      
      console.log('Fetched current affairs:', data);
      
      if (Array.isArray(data)) {
        setAffairs(data);
        setError(null);
      } else if (data.error) {
        setError(data.error);
        setAffairs([]);
      } else {
        setAffairs([]);
      }
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      setError(error.message);
      setAffairs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAffairs = affairs.filter(affair => {
    const affairDate = affair.date ? new Date(affair.date).toISOString().split('T')[0] : '';
    return affairDate === selectedDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2">📰</div>
          <h1 className="text-2xl font-bold">Current Affairs</h1>
          <p className="text-orange-100 text-xs mt-1">Daily updates for competitive exams</p>
        </div>
      </div>

      {/* Date Picker */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm">⚠️ {error}</p>
            <button onClick={fetchCurrentAffairs} className="mt-2 text-sm text-red-600 underline">Try Again</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading current affairs...</p>
        </div>
      )}

      {/* Current Affairs List */}
      {!loading && !error && (
        <div className="max-w-md mx-auto px-4 mt-4 mb-20">
          <div className="bg-orange-50 rounded-xl p-3 mb-4">
            <p className="text-center text-sm text-orange-800">
              📅 {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {filteredAffairs.length > 0 ? (
            <div className="space-y-4">
              {filteredAffairs.map((affair, idx) => (
                <div key={affair._id || idx} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl">
                      📰
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{affair.title || 'Current Affairs'}</h3>
                      <p className="text-gray-600 text-sm mt-2">{affair.content || affair.description || 'No description available'}</p>
                      {affair.source && (
                        <p className="text-xs text-gray-400 mt-2">Source: {affair.source}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-6xl mb-3">📭</div>
              <p className="text-gray-600 font-medium">No current affairs for this date</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="mt-4 text-orange-600 text-sm underline"
              >
                Go to Today
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-orange-600">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🎯</span><span className="text-xs">Test</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
