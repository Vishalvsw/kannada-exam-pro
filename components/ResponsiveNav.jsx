'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ClientOnly from '@/components/ClientOnly';

export default function ResponsiveNav({ children }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [deviceType, setDeviceType] = useState('mobile');
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) setDeviceType('mobile');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const navItems = [
    { path: '/', label: t.home, icon: '🏠' },
    { path: '/quiz', label: t.quiz, icon: '❓' },
    { path: '/notes', label: t.notes, icon: '📝' },
    { path: '/current-affairs', label: t.currentAffairs, icon: '📰' },
    { path: '/leaderboard', label: t.leaderboard, icon: '🏆' },
  ];
  
  if (user) navItems.push({ path: '/profile', label: t.profile, icon: '👤' });

  if (!mounted) {
    return <div className="min-h-screen bg-white"></div>;
  }

  // Mobile View
  if (deviceType === 'mobile') {
    return (
      <ClientOnly>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">{t.appName}</span>
                <span className="text-blue-200 text-xs">{t.tagline}</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              {user ? (
                <>
                  <img src={user.profileImage} className="w-8 h-8 rounded-full border-2 border-white" />
                  <button onClick={handleLogout} className="text-xs bg-white/20 px-2 py-1 rounded-lg text-white">{t.logout}</button>
                </>
              ) : (
                <Link href="/login" className="text-sm bg-white text-blue-600 px-3 py-1 rounded-lg font-semibold">{t.login}</Link>
              )}
            </div>
          </div>
        </div>
        <main className="pb-16">{children}</main>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </ClientOnly>
    );
  }

  // Desktop View
  return (
    <ClientOnly>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Logo size="md" showText={false} />
                <div className="flex flex-col">
                  <span className="text-gray-800 font-bold text-lg">{t.appName}</span>
                  <span className="text-gray-500 text-xs">{t.tagline}</span>
                </div>
              </Link>
              <div className="hidden md:flex ml-10 space-x-4">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span className="mr-1">{item.icon}</span>{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              {user ? (
                <div className="flex items-center space-x-3">
                  <img src={user.profileImage} className="w-8 h-8 rounded-full" />
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold">@{user.instagramId}</p>
                    <p className="text-xs text-gray-500">{user.score || 0} {t.points}</p>
                  </div>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">{t.logout}</button>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg">{t.login}</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </ClientOnly>
  );
}
