'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👑</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-600 text-sm mt-2">Enter your credentials to access admin panel</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="admin@kannadaexampro.com" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500 mb-2">Demo Admin Credentials:</div>
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Email:</strong> admin@kannadaexampro.com</p>
              <p><strong>Password:</strong> Admin@123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">← Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
