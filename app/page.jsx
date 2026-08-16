'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import Image from 'next/image';

export default function Home() {
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const slidingLogos = useMemo(() => [
    { image: '/logos/police.png', name: 'Police', color: 'from-blue-500 to-blue-600' },
    { image: '/logos/defence.jpg', name: 'Defence', color: 'from-green-500 to-green-600' },
    { image: '/logos/SBI.jpeg', name: 'SBI', color: 'from-yellow-500 to-yellow-600' },
    { image: '/logos/ssc.jpeg', name: 'SSC', color: 'from-purple-500 to-purple-600' },
    { image: '/logos/bsf.jpeg', name: 'BSF', color: 'from-pink-500 to-pink-600' },
    { image: '/logos/all jobs.jpeg', name: 'All Jobs', color: 'from-gray-500 to-gray-600' },
    { image: '/logos/railways.jpeg', name: 'Railways', color: 'from-red-500 to-red-600' },
  ], []);

  const categories = useMemo(() => [
    { title: 'Quiz', icon: '❓', color: 'from-blue-500 to-blue-600', href: '/quiz', desc: '20 MCQ / Win Prizes' },
    { title: 'Notes', icon: '📝', color: 'from-green-500 to-green-600', href: '/notes', desc: '50 imp Questions & Answers' },
    { title: 'Current Affairs', icon: '📰', color: 'from-orange-500 to-orange-600', href: '/current-affairs', desc: 'Check It Now' },
    { title: 'Leaderboard', icon: '🏆', color: 'from-yellow-500 to-yellow-600', href: '/leaderboard', desc: 'Top Winners' },
  ], []);

  // Load user from localStorage instantly
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      setUser(null);
    }
  }, []);

  // Check cache first, then fetch
  useEffect(() => {
    // Try to load from cache first
    const cachedData = localStorage.getItem('leaderboard_cache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Use cache if less than 5 minutes old
        if (Date.now() - parsed.timestamp < 300000) {
          setTopUsers(parsed.data.slice(0, 5));
          setIsDataLoaded(true);
        }
      } catch (e) {
        // Cache invalid, will fetch
      }
    }
    
    // Always fetch fresh data in background
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const usersRes = await fetch('/api/leaderboard');
      const users = await usersRes.json();
      
      let usersArray = [];
      if (Array.isArray(users)) {
        usersArray = users;
      } else if (users && Array.isArray(users.users)) {
        usersArray = users.users;
      } else if (users && users.success && Array.isArray(users.users)) {
        usersArray = users.users;
      }
      
      const topFive = usersArray.slice(0, 5);
      setTopUsers(topFive);
      
      // Save to cache
      localStorage.setItem('leaderboard_cache', JSON.stringify({
        data: usersArray,
        timestamp: Date.now()
      }));
      
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsDataLoaded(true);
    }
  }, []);

  // Start logo animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % slidingLogos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slidingLogos.length]);

  const currentLogo = slidingLogos[currentLogoIndex];
  const maxScore = topUsers.length > 0 ? Math.max(...topUsers.map(u => u.score || 0)) : 100;

  // Leaderboard component
  const LeaderboardSection = useMemo(() => {
    if (topUsers.length === 0) {
      return (
        <div className="px-5 mt-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-8 text-center">
            <span className="text-5xl mb-3 block">🏆</span>
            <h3 className="text-lg font-semibold text-gray-800">No Winners Yet!</h3>
            <p className="text-sm text-gray-500 mt-2">Be the first to take the quiz and win!</p>
            <Link href="/quiz">
              <button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                Start Quiz Now 🎯
              </button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🏆 Top Winners 
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Top {topUsers.length}</span>
          </h2>
          <Link href="/leaderboard" className="text-xs text-blue-600 hover:underline">View All →</Link>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-5">
          <div className="space-y-4">
            {topUsers.map((user, idx) => {
              const rank = idx + 1;
              const scorePercentage = maxScore > 0 ? Math.min((user.score / maxScore) * 100, 100) : 0;
              
              const rankIcon = { 1: '👑', 2: '🥈', 3: '🥉' };
              const rankColor = { 1: 'text-yellow-600', 2: 'text-gray-600', 3: 'text-orange-600' };
              const barColor = {
                1: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
                2: 'bg-gradient-to-r from-gray-400 to-gray-500',
                3: 'bg-gradient-to-r from-orange-400 to-orange-500',
                4: 'bg-gradient-to-r from-blue-400 to-blue-500',
                5: 'bg-gradient-to-r from-green-400 to-green-500',
              };
              
              return (
                <div key={user._id || idx} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-lg font-bold flex-shrink-0 ${rank <= 3 ? rankColor[rank] : 'text-purple-600'}`}>
                        {rank <= 3 ? rankIcon[rank] : `${rank}th`}
                      </span>
                      <p className="font-semibold text-gray-800 text-sm truncate max-w-[120px]">
                        {user.name?.split(' ')[0] || 'User'}
                      </p>
                      <span className="text-xs text-gray-400 truncate max-w-[80px] hidden sm:inline">
                        @{user.instagramId || 'user'}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-purple-600">{user.score || 0}</p>
                    </div>
                  </div>
                  
                  <div className="relative w-full bg-gray-200 rounded-full h-7 overflow-hidden">
                    <div 
                      className={`h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out ${
                        barColor[rank] || 'bg-gradient-to-r from-purple-400 to-purple-500'
                      }`}
                      style={{ width: `${Math.max(scorePercentage, 5)}%` }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {Math.round(scorePercentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-purple-200 text-center">
            <p className="text-xs text-gray-500">🏆 Keep practicing to reach the top!</p>
          </div>
        </div>
      </div>
    );
  }, [topUsers, maxScore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-10 text-center">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Kannada Exam Pro</h1>
          <p className="text-blue-100 text-sm mt-1">KAS | PSI | PDO | FDA | SDA</p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 animate-slide-left inline-block shadow-xl">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLogo.color} flex items-center justify-center p-1 shadow-lg ring-4 ring-white/50`}>
                <Image 
                  src={currentLogo.image} 
                  alt={currentLogo.name}
                  width={56}
                  height={56}
                  priority={currentLogoIndex === 0}
                  loading={currentLogoIndex === 0 ? 'eager' : 'lazy'}
                  className="w-14 h-14 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center"><span class="text-white text-xl font-bold">📚</span></div>`;
                  }}
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{currentLogo.name}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {slidingLogos.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentLogoIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {user && (
        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={user.profileImage || user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff&size=80`} 
                className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
                alt={user.name}
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff&size=80`;
                }}
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Welcome back, {user.name?.split(' ')[0]}! 👋</p>
                <p className="text-xs text-gray-500">@{user.instagramId}</p>
                <p className="text-xs text-green-600 font-medium">⭐ Total Score: {user.score || 0} points</p>
              </div>
            </div>
            <Link href="/quiz">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                Take Quiz 🎯
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mt-2">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdSpace type="inArticle" className="mx-4 my-6" />

      {/* Leaderboard - Rendered with useMemo */}
      {isDataLoaded && LeaderboardSection}

      <div className="px-5 mt-8 mb-4 text-center">
        <p className="text-sm text-gray-500">For Daily Quiz and Updates</p>
        <p className="text-xs text-gray-400 mb-3">Join More Channels</p>
        
        <div className="flex justify-center gap-5">
          <a
            href="https://whatsapp.com/channel/0029VbCnlxq3wtbEGjkxIM2M"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">💬</span>
            </div>
            <span className="text-xs text-gray-600 mt-1 group-hover:text-green-600 transition">WhatsApp</span>
          </a>
          
          <a
            href="https://www.instagram.com/kannada_exam_pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">📸</span>
            </div>
            <span className="text-xs text-gray-600 mt-1 group-hover:text-pink-600 transition">Instagram</span>
          </a>
        </div>
      </div>

      {!user && (
        <div className="text-center mt-4">
          <Link href="/login" className="text-xs text-gray-400 hover:text-blue-500 transition">
            🔐 Admin / Login
          </Link>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-4 mb-4" />

      <style jsx>{`
        @keyframes slideLeft {
          0% { transform: translateX(30%); opacity: 0; }
          12% { transform: translateX(0); opacity: 1; }
          88% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-30%); opacity: 0; }
        }
        .animate-slide-left { 
          animation: slideLeft 5s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
