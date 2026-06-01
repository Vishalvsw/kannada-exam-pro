'use client';

import { useState, useEffect } from 'react';
import { useDemoAuth } from '@/components/DemoAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function DemoLoginPage() {
  const { demoLogin, loading, demoUsers } = useDemoAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showDemoAnimation, setShowDemoAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (showDemoAnimation) {
      const timer = setTimeout(() => {
        if (animationStep === 0) {
          setEmail(demoUsers[0].email);
          setAnimationStep(1);
        } else if (animationStep === 1) {
          demoLogin(demoUsers[0].email);
          setAnimationStep(2);
        } else if (animationStep === 2) {
          router.push('/');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showDemoAnimation, animationStep, demoLogin, router, demoUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await demoLogin(email);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <Logo size="xl" variant="full" showText={true} />
            <p className="text-gray-600 text-sm mt-3">Login to continue your preparation</p>
          </div>

          {showDemoAnimation && animationStep < 2 && (
            <div className="mb-5 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-800">Demo Animation Running...</p>
                  <p className="text-xs text-blue-600">
                    {animationStep === 0 && '📝 Auto-filling email...'}
                    {animationStep === 1 && '🔐 Logging in...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Kannada Exam Pro'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-3">Demo Accounts (Click to auto-fill)</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setEmail(user.email)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <img src={user.image} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">← Back to Home</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
