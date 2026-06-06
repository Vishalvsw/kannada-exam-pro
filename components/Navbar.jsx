'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function Home() {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % slidingLogos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, usersRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/leaderboard'),
      ]);
      const questions = await questionsRes.json();
      const users = await usersRes.json();
      setTotalQuestions(questions.length);
      setTopUsers(users.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const slidingLogos = [
    { name: 'KAS Exam', icon: '👨‍⚖️', color: 'from-blue-500 to-blue-600' },
    { name: 'PSI Exam', icon: '👮', color: 'from-green-500 to-green-600' },
    { name: 'PDO Exam', icon: '📋', color: 'from-purple-500 to-purple-600' },
    { name: 'FDA Exam', icon: '📝', color: 'from-orange-500 to-orange-600' },
    { name: 'SDA Exam', icon: '📊', color: 'from-red-500 to-red-600' },
  ];

  const currentLogo = slidingLogos[currentLogoIndex];

  const categories = [
    { title: 'Quiz', icon: '❓', color: 'from-blue-500 to-blue-600', href: '/quiz', desc: '20 MCQ / Win Prizes', bgColor: 'bg-blue-50' },
    { title: 'Notes', icon: '📝', color: 'from-green-500 to-green-600', href: '/notes', desc: '50 imp Questions & Answers', bgColor: 'bg-green-50' },
    { title: 'Current Affairs', icon: '📰', color: 'from-orange-500 to-orange-600', href: '/current-affairs', desc: 'Check It Now', bgColor: 'bg-orange-50' },
    { title: 'Leaderboard', icon: '🏆', color: 'from-yellow-500 to-yellow-600', href: '/leaderboard', desc: 'Top Winners', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Hero Section - Smaller */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-4 pb-6 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl">🎯</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Topexams Prep</h1>
        <p className="text-blue-100 text-xs mt-1">KAS | PSI | PDO | FDA | SDA</p>
        
        {/* Sliding Logos - Animated */}
        <div className="mt-4 overflow-hidden">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 animate-slide-left">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentLogo.color} flex items-center justify-center text-lg shadow-lg`}>
              {currentLogo.icon}
            </div>
            <span className="font-semibold text-xs">{currentLogo.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
            <span className="text-[10px] opacity-75">Next: {slidingLogos[(currentLogoIndex + 1) % slidingLogos.length].name}</span>
          </div>
        </div>
      </div>

      {/* User Welcome Card */}
      {user && (
        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={user.profileImage} className="w-10 h-10 rounded-full border-2 border-blue-500" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">@{user.instagramId}</p>
                <p className="text-xs text-gray-500">Total Score: {user.score || 0} points</p>
              </div>
            </div>
            <Link href="/quiz">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Take Quiz →</button>
            </Link>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="bg-white rounded-2xl shadow-md p-3 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-2xl shadow-md`}>
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

      {/* Top Winners */}
      {topUsers.length > 0 && (
        <div className="px-5 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">🏆 Top Winners</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4">
            <div className="space-y-2">
              {topUsers.map((user, idx) => (
                <div key={user._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>
                    {idx + 1}
                  </div>
                  <img src={user.image} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.instagramId || user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{user.score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard">
              <button className="w-full mt-3 text-blue-600 font-semibold text-sm hover:underline">📊 View All →</button>
            </Link>
          </div>
        </div>
      )}

      {/* WhatsApp & Instagram Integration */}
      <div className="px-5 mt-8 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/kannada_exam_pro?igsh=MTg2ZzZ0ZGNnYWk2"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-4 text-white text-center hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📸</span>
              <div>
                <p className="font-semibold text-sm">Join Instagram</p>
                <p className="text-xs opacity-90">Get Daily Updates</p>
              </div>
            </div>
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://whatsapp.com/channel/0029VbCnlxq3wtbEGjkxIM2M"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white text-center hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-sm">Join WhatsApp</p>
                <p className="text-xs opacity-90">Get Exam Alerts</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-4 mb-4" />

      <style jsx>{`
        @keyframes slideLeft {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-slide-left { animation: slideLeft 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}