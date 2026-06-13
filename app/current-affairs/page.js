'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairsPage() {
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [filteredAffairs, setFilteredAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
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
      setError(null);
      const response = await fetch('/api/current-affairs');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        console.log(`Fetched ${data.length} current affairs`);
        setCurrentAffairs(data);
        if (data.length === 0) {
          setError('No current affairs found. Please add some from admin panel.');
        }
      } else {
        setCurrentAffairs([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      setError('Failed to load current affairs');
      setCurrentAffairs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAffairs = () => {
    let filtered = [...currentAffairs];
    
    if (searchTerm) {
      filtered = filtered.filter(affair => 
        affair.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affair.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDate) {
      filtered = filtered.filter(affair => {
        const affairDate = affair.date ? new Date(affair.date).toISOString().split('T')[0] : '';
        return affairDate === selectedDate;
      });
    }
    
    setFilteredAffairs(filtered);
  };

  const uniqueDates = [...new Set(currentAffairs.map(a => a.date))].filter(date => date).sort().reverse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-5xl">📰</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Current Affairs</h1>
              <p className="text-green-100 text-sm mt-1">Daily updates for competitive exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search current affairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="max-w-6xl mx-auto px-5 mt-3">
        <button 
          onClick={fetchCurrentAffairs}
          className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Date Filter */}
      <div className="max-w-6xl mx-auto px-5 mt-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition bg-white px-3 py-1.5 rounded-lg shadow-sm"
          >
            <span>📅</span>
            <span>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Filter by Date'}</span>
          </button>
          {selectedDate && (
            <button onClick={() => setSelectedDate('')} className="text-xs text-red-500 hover:text-red-700">
              Clear Date
            </button>
          )}
          {currentAffairs.length > 0 && (
            <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-lg shadow-sm">
              📊 Total: {currentAffairs.length}
            </span>
          )}
        </div>

        {showDateFilter && (
          <div className="mt-2 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedDate(''); setShowDateFilter(false); }}
                className={`px-3 py-1 rounded-full text-xs transition ${!selectedDate ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All Dates
              </button>
              {uniqueDates.map(date => (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setShowDateFilter(false); }}
                  className={`px-3 py-1 rounded-full text-xs transition ${selectedDate === date ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {new Date(date).toLocaleDateString()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading current affairs...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 rounded-2xl p-12 text-center border border-yellow-200">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{error}</h3>
            <p className="text-gray-500 text-sm">Please add current affairs from the admin panel.</p>
          </div>
        ) : filteredAffairs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAffairs.map((affair, idx) => (
              <div key={affair._id || idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                  <div className="text-3xl mb-2">📰</div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm line-clamp-2 flex-1">{affair.title}</h3>
                    {affair.date && (
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                        {new Date(affair.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {affair.content?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">
                      📅 {affair.date ? new Date(affair.date).toLocaleDateString() : 'No date'}
                    </span>
                    <Link href={`/current-affairs/${affair._id}`}>
                      <span className="text-green-600 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:gap-2 transition-all">
                        Read More
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Current Affairs Found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || selectedDate ? 'Try changing your search or clear the date filter' : 'Current affairs will appear here once added.'}
            </p>
          </div>
        )}
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
          <Link href="/current-affairs" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
