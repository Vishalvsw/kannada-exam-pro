'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SessionPage() {
  const router = useRouter();
  const [loginTime, setLoginTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    
    let storedLoginTime = localStorage.getItem('loginTime');
    if (!storedLoginTime) {
      storedLoginTime = Date.now();
      localStorage.setItem('loginTime', storedLoginTime);
    }
    setLoginTime(new Date(parseInt(storedLoginTime)));
  }, [router]);

  useEffect(() => {
    if (!loginTime) return;
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - loginTime.getTime()) / 1000);
      setSessionDuration(duration);
      localStorage.setItem('sessionDuration', duration);
    }, 1000);
    return () => clearInterval(interval);
  }, [loginTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <img src={user.profileImage} className="w-20 h-20 rounded-full mx-auto border-4 border-blue-500" />
          <h1 className="text-xl font-bold mt-3">Session Details</h1>
          <p className="text-gray-600">@{user.instagramId}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Login Time</p>
            <p className="text-xl font-bold">{loginTime?.toLocaleTimeString()}</p>
            <p className="text-xs text-gray-500">{loginTime?.toLocaleDateString()}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Session Duration</p>
            <p className="text-2xl font-bold text-green-600">{formatTime(sessionDuration)}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Your Score</p>
            <p className="text-2xl font-bold text-purple-600">{user.score || 0}</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Link href="/quiz" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center">Take Quiz</Link>
          <Link href="/profile" className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-center">Profile</Link>
        </div>
      </div>
    </div>
  );
}
