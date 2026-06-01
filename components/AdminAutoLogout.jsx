'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAutoLogout({ children }) {
  const router = useRouter();

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // Clear admin session
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        sessionStorage.clear();
        // Redirect to login
        router.push('/admin-login');
        alert('Session expired. Please login again.');
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Events that reset the timer
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer(); // Start timer

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  return children;
}