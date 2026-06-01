'use client';

import { useState, useEffect } from 'react';

const logos = [
  { name: 'KAS Exam', icon: '👨‍⚖️', color: 'from-blue-500 to-blue-600' },
  { name: 'PSI Exam', icon: '👮', color: 'from-green-500 to-green-600' },
  { name: 'PDO Exam', icon: '📋', color: 'from-purple-500 to-purple-600' },
  { name: 'FDA Exam', icon: '📝', color: 'from-orange-500 to-orange-600' },
  { name: 'SDA Exam', icon: '📊', color: 'from-red-500 to-red-600' },
  { name: 'Police Exam', icon: '🚔', color: 'from-indigo-500 to-indigo-600' },
];

export default function SlidingLogos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentLogo = logos[currentIndex];

  return (
    <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 animate-slide-left">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentLogo.color} flex items-center justify-center text-2xl shadow-lg`}>
        {currentLogo.icon}
      </div>
      <span className="font-semibold text-sm">{currentLogo.name}</span>
      <span className="w-2 h-2 rounded-full bg-white/50"></span>
      <span className="text-xs opacity-75">Next: {logos[(currentIndex + 1) % logos.length].name}</span>
    </div>
  );
}
