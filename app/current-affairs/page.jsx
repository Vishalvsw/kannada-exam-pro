'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairsPage() {
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [filteredAffairs, setFilteredAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

  useEffect(() => {
    filterAffairs();
  }, [currentAffairs, searchTerm, selectedDate]);

  const fetchCurrentAffairs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/current-affairs');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCurrentAffairs(data);
        setError(null);
      } else {
        setCurrentAffairs([]);
      }
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      setError(error.message);
      setCurrentAffairs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAffairs = () => {
    let filtered = [...currentAffairs];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(affair => 
        affair.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affair.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affair.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(affair => {
        const affairDate = affair.date ? new Date(affair.date).toISOString().split('T')[0] : '';
        return affairDate === selectedDate;
      });
    }
    
    setFilteredAffairs(filtered);
  };

  const uniqueDates = [...new Set(currentAffairs.map(a => 
    a.date ? new Date(a.date).toISOString().split('T')[0] : ''
  ))].filter(date => date);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header - Keep your design */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2 animate-bounce">📰</div>
          <h1 className="text-2xl font-bold">Current Affairs</h1>
          <p className="text-orange-100 text-xs mt-1">Daily updates for competitive exams</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search current affairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && currentAffairs.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-center text-sm text-orange-800">
              📊 Total Updates: {currentAffairs.length} | 
              Showing: {filteredAffairs.length}
            </p>
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

      {/* Error Message */}
      {error && !loading && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">⚠️ {error}</p>
            <button onClick={fetchCurrentAffairs} className="mt-2 text-sm text-red-600 underline">Try Again</button>
          </div>
        </div>
      )}

      {/* Current Affairs List */}
      {!loading && !error && (
        <div className="max-w-md mx-auto px-4 mt-4 mb-20">
          {filteredAffairs.length > 0 ? (
            <div className="space-y-4">
              {filteredAffairs.map((affair, idx) => (
                <div key={affair._id || idx} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      📰
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">{affair.title || 'Current Affairs'}</h3>
                        {affair.date && (
                          <span className="text-xs text-gray-400">
                            {new Date(affair.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {affair.content || affair.description || 'No description available'}
                      </p>
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
              <p className="text-gray-600 font-medium">No current affairs found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm || selectedDate !== new Date().toISOString().split('T')[0] 
                  ? 'Try changing your search or date filter'
                  : 'Check back later for updates'}
              </p>
              {(searchTerm || selectedDate !== new Date().toISOString().split('T')[0]) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="mt-4 text-orange-600 text-sm underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation - Keep your design */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-orange-600">
            <span className="text-xl">📰</span>
            <span className="text-xs">Current</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🎯</span>
            <span className="text-xs">Test</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">🏆</span>
            <span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
