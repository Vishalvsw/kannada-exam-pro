'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', activeColor: 'text-blue-600' },
    { path: '/quiz', icon: '❓', label: 'Quiz', activeColor: 'text-purple-600' },
    { path: '/notes', icon: '📝', label: 'Notes', activeColor: 'text-green-600' },
    { path: '/current-affairs', icon: '📰', label: 'News', activeColor: 'text-orange-600' },
    { path: '/leaderboard', icon: '🏆', label: 'Top', activeColor: 'text-yellow-600' },
  ];
  
  if (user) {
    navItems.push({ path: '/profile', icon: '👤', label: 'Profile', activeColor: 'text-indigo-600' });
  }

  return (
    <div className="mobile-only fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 safe-bottom">
      <div className="flex justify-around items-center px-3 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${isActive ? item.activeColor : 'text-gray-500'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
