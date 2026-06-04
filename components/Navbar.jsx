'use client';

import { useDemoAuth } from '@/components/DemoAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useDemoAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoVersion, setLogoVersion] = useState(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-refresh logo in development
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoVersion(Date.now());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsProfileOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/quiz', label: 'Quiz', icon: '❓' },
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/current-affairs', label: 'Current Affairs', icon: '📰' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }
  
  if (user) {
    navItems.push({ path: '/profile', label: 'Profile', icon: '👤' });
  }

  const logoSrc = `/images/logo.png?v=${logoVersion}`;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-1.5 text-xs font-medium">
        <span>📢 Daily Quiz: One attempt per 24 hours | 🏆 Top scorers get featured on leaderboard!</span>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm shadow-md py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {!logoError ? (
                <div className="w-10 h-10 overflow-hidden rounded-xl shadow-md group-hover:scale-105 transition-transform bg-gray-100 flex items-center justify-center">
                  <img
                    src={logoSrc}
                    alt="Kannada Exam Pro Logo"
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-xl"></span>                  
                </div>
              )}
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Kannada Exam Pro
                </span>
                <span className="ml-2 text-xs text-gray-500 hidden sm:inline">KAS | PSI | PDO | FDA | SDA</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                    pathname === item.path
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                    className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
                  >
                    <img 
                      src={user.image || user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                      className="w-9 h-9 rounded-full border-2 border-green-500 object-cover" 
                      alt={user.name} 
                    />
                    <span className="hidden lg:block text-sm font-medium text-gray-700">
                      {user.name?.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-50">
                      <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.image || user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                            className="w-12 h-12 rounded-full border-2 border-green-500" 
                            alt={user.name} 
                          />
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-gray-500">@{user.instagramId || 'user'}</p>
                            <p className="text-xs text-green-600">Score: {user.score || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                        >
                          👤 Profile
                        </Link>
                        <Link 
                          href="/quiz" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                        >
                          🎯 Take Quiz
                        </Link>
                        <Link 
                          href="/leaderboard" 
                          onClick={() => setIsProfileOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                        >
                          🏆 Leaderboard
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsProfileOpen(false)} 
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                          >
                            ⚙️ Admin
                          </Link>
                        )}
                        <hr />
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/demo-login" 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold"
                >
                  🚀 Demo Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col gap-2 pt-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      pathname === item.path 
                        ? 'bg-green-600 text-white' 
                        : 'hover:bg-green-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}