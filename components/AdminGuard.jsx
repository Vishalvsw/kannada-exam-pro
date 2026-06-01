'use client';

import { useEffect } from 'react';
import { useDemoAuth } from '@/components/DemoAuth';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }) {
  const { user } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/admin-login');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
