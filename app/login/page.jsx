'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '@/components/GoogleLogin';
import { useLanguage } from '@/contexts/LanguageContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '631788793965-cnah9hm9s0vq7qis7em75jui1net5ebp.apps.googleusercontent.com';

function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/');
    }
  }, [router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-bounce">🎯</div>
            <h1 className="text-2xl font-bold text-gray-800">{t.appName}</h1>
            <p className="text-gray-600 text-sm mt-2">{t.startPreparation}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <GoogleLogin />
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>By continuing, you agree to our Terms and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
