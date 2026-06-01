'use client';

import { useDemoAuth } from '@/components/DemoAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNav() {
  const { user, logout } = useDemoAuth();
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/quiz', label: 'Quiz', icon: '❓' },
    { path: '/current-affairs', label: 'Current Affairs', icon: '📰' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  if (user) {
    navItems.push({ path: '/profile', label: 'Profile', icon: '👤' });
  }

  return (
    <nav className="desktop-only bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GK ಕ್ವಿಜ್
              </span>
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.score || 0} points</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/demo-login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all"
              >
                🚀 Demo Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
