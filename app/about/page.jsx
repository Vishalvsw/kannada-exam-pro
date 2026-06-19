'use client';

import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-green-100 text-sm mt-1">Your Trusted Partner for Karnataka Exam Preparation</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Welcome */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">👋 Welcome to Kannada Exam Pro</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>Kannada Exam Pro</strong> is an educational website created to help students and competitive exam aspirants. Our main goal is to provide useful study materials, GK questions, quizzes, and exam-related information in a simple and easy-to-understand way.
            </p>
          </section>

          {/* Mission */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make learning easier and help students prepare for exams with quality content. We aim to provide accurate and helpful information for daily study and competitive exams like <strong>KAS, PSI, PDO, FDA, and SDA</strong>.
            </p>
          </section>

          {/* What We Offer */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📚 What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl mb-1">❓</div>
                <h3 className="font-semibold text-gray-800">Interactive Quizzes</h3>
                <p className="text-xs text-gray-500">20 MCQ questions with timer</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl mb-1">📝</div>
                <h3 className="font-semibold text-gray-800">Study Notes</h3>
                <p className="text-xs text-gray-500">Detailed exam preparation notes</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-2xl mb-1">📰</div>
                <h3 className="font-semibold text-gray-800">Current Affairs</h3>
                <p className="text-xs text-gray-500">Daily updates for competitive exams</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl mb-1">🏆</div>
                <h3 className="font-semibold text-gray-800">Leaderboard</h3>
                <p className="text-xs text-gray-500">Track your performance</p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">⭐ Why Choose Us?</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-gray-600"><strong>100% Free</strong> – No hidden charges</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-gray-600"><strong>Bilingual Content</strong> – Kannada & English</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-gray-600"><strong>Regular Updates</strong> – Fresh content daily</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-gray-600"><strong>Mobile-Friendly</strong> – Study on the go</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-gray-600"><strong>24/7 Access</strong> – Study anytime, anywhere</span>
              </div>
            </div>
          </section>

          {/* Content Accuracy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📌 Content Accuracy</h2>
            <p className="text-gray-600 leading-relaxed">
              We try our best to provide correct and updated information, but we do not guarantee 100% accuracy. Users are advised to verify important information independently from official sources.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">📧 Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions, suggestions, or feedback, feel free to contact us:
            </p>
            <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700">
                <strong>📧 Email:</strong> kannadaexampro@gmail.com
              </p>
              <p className="text-gray-700 mt-1">
                <strong>🌐 Website:</strong> kannadaexampro.com
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Home
              </Link>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Kannada Exam Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

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
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
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
