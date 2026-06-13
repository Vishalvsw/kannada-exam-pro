'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [affair, setAffair] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCurrentAffair();
    }
  }, [id]);

  const fetchCurrentAffair = async () => {
    try {
      const response = await fetch(`/api/current-affairs/${id}`);
      const data = await response.json();
      
      if (data && !data.error) {
        setAffair(data);
      } else {
        setError('Current affair not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load content');
    }
  };

  if (error || !affair) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-5xl mb-2">📰</div>
            <h1 className="text-2xl font-bold">Current Affairs</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-5 py-12 text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <p className="text-red-600">{error || 'Content not found'}</p>
            <Link href="/current-affairs">
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                ← Back to Current Affairs
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/current-affairs" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-5xl">📰</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{affair.title}</h1>
              {affair.date && (
                <p className="text-green-100 text-sm mt-2">
                  📅 {new Date(affair.date).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="prose prose-green max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                {affair.content}
              </div>
              
              {affair.source && affair.source !== 'Admin' && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    📌 Source: {affair.source}
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🏷️</span>
                  <span>{affair.category || 'General'}</span>
                  {affair.important && (
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      Important
                    </span>
                  )}
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-green-600 text-sm hover:text-green-700 transition flex items-center gap-1"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">📢 Share this update with friends</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigator.share && navigator.share({ title: affair.title, text: affair.content, url: window.location.href })}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              📤 Share
            </button>
            <Link href="/quiz">
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">
                🎯 Take Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
