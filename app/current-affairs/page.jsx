'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairsPage() {
  const [affairs, setAffairs] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  // Load data instantly on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchCurrentAffairs(today);
  }, []);

  const fetchCurrentAffairs = async (date) => {
    try {
      const res = await fetch('/api/current-affairs');
      const data = await res.json();
      const affairsData = Array.isArray(data) ? data : [];
      const filtered = affairsData.filter(a => a.date === date);
      setAffairs(filtered);
    } catch (error) {
      console.error('Error fetching affairs:', error);
      setAffairs([]);
    }
  };

  const handleDateSelect = (day) => {
    const newDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(newDate);
    setCalendarOpen(false);
    fetchCurrentAffairs(newDate);
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const filteredAffairs = affairs.filter(affair => {
    const matchesSearch = searchTerm === '' || 
                          affair.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          affair.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Select a date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    const todayStr = today.toISOString().split('T')[0];
    setSelectedDate(todayStr);
    setCalendarOpen(false);
    fetchCurrentAffairs(todayStr);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header - Green */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-6 pb-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-2">📰</div>
          <h1 className="text-2xl font-bold">Current Affairs</h1>
          <p className="text-green-100 text-sm mt-1">Daily updates for competitive exams</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg p-3">
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

      {/* Date Picker */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-90">Selected Date</p>
                <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
              </div>
              <button 
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="bg-white/20 px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition"
              >
                {calendarOpen ? 'Close 📅' : 'Change Date 📅'}
              </button>
            </div>
          </div>

          {calendarOpen && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth('prev')} className="w-8 h-8 rounded-full hover:bg-gray-100 transition">◀</button>
                <h3 className="font-semibold text-gray-800">
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                </h3>
                <button onClick={() => changeMonth('next')} className="w-8 h-8 rounded-full hover:bg-gray-100 transition">▶</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-gray-500 font-semibold text-xs py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array(getFirstDayOfMonth(currentYear, currentMonth)).fill().map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array(getDaysInMonth(currentYear, currentMonth)).fill().map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate() && 
                                  currentMonth === new Date().getMonth() && 
                                  currentYear === new Date().getFullYear();
                  const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      className={`p-2 rounded-lg hover:bg-green-100 transition ${
                        isSelected ? 'bg-green-600 text-white font-bold' : 
                        isToday ? 'bg-green-100 text-green-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToToday}
                className="w-full mt-4 text-center text-xs text-green-600 py-2 border-t hover:bg-green-50 transition"
              >
                📅 Go to Today
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">📅 {formatDate(selectedDate)}</h2>
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {filteredAffairs.length} {filteredAffairs.length === 1 ? 'update' : 'updates'}
          </p>
        </div>

        {/* Content - Instant Display */}
        {filteredAffairs.length > 0 ? (
          <div className="space-y-3">
            {filteredAffairs.map((affair, idx) => (
              <div key={affair._id || idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="border-l-4 border-green-500 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm leading-relaxed">
                        {affair.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          📅 {affair.date}
                        </span>
                        {affair.category && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            📂 {affair.category}
                          </span>
                        )}
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-green-600 text-xs font-medium hover:text-green-700 transition inline-flex items-center gap-1">
                          <span>📖</span> Read More
                        </summary>
                        <p className="text-xs text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg leading-relaxed">
                          {affair.content}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-6xl mb-3">📰</div>
            <p className="text-gray-600 font-medium">No current affairs for this date</p>
            <button 
              onClick={goToToday}
              className="mt-4 text-sm text-green-600 underline hover:text-green-700 transition"
            >
              📅 Go to Today
            </button>
          </div>
        )}
      </div>

      {/* Daily Quiz Link */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <Link href="/quiz">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 text-white text-center hover:shadow-lg transition transform hover:scale-105">
            <p className="font-semibold">📝 Take Daily Quiz</p>
          </div>
        </Link>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-xs">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📝</span><span className="text-xs">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
