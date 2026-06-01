'use client';

import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3">📖</div>
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-green-100 text-sm mt-2">Your Trusted Partner for Karnataka Exam Preparation</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Our Mission</h2>
          <p className="text-gray-600">At Kannada Exam Pro, our mission is to provide high-quality, accessible, and affordable exam preparation materials for Karnataka government exam aspirants.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="text-2xl">❓</span> Interactive Quizzes</div>
            <div><span className="text-2xl">📝</span> Study Notes</div>
            <div><span className="text-2xl">📰</span> Current Affairs</div>
            <div><span className="text-2xl">🏆</span> Leaderboard</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ Why Choose Us?</h2>
          <div className="space-y-2">
            <div>✓ 100% Free - No hidden charges</div>
            <div>✓ Bilingual content (Kannada & English)</div>
            <div>✓ Regular content updates</div>
            <div>✓ Mobile-friendly design</div>
            <div>✓ 24/7 access from anywhere</div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            ← Back to Home
          </Link>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />
    </div>
  );
}
