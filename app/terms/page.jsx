'use client';

import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="text-blue-100 text-sm mt-1">Last Updated: 19 June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to <strong>Kannada Exam Pro</strong> (kannadaexampro.com). By accessing and using this website, you agree to follow these Terms and Conditions. If you do not agree, please do not use our website.
            </p>
          </section>

          {/* Use of Website */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Use of Website</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to use this website only for lawful purposes. You must not:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
              <li>Copy or reuse content without permission</li>
              <li>Post harmful or illegal content</li>
              <li>Attempt to hack or damage the website</li>
              <li>Share answers or cheat on quizzes</li>
              <li>Create multiple accounts to manipulate leaderboard</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website (articles, questions, images, and design) belongs to <strong>Kannada Exam Pro</strong> unless stated otherwise. Unauthorized use, reproduction, or distribution is not allowed.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and providing accurate information. You are also responsible for all activities that occur under your account.
            </p>
          </section>

          {/* Content Accuracy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Content Accuracy</h2>
            <p className="text-gray-600 leading-relaxed">
              We try our best to provide correct and updated information, but we do not guarantee 100% accuracy. Users should verify important information independently from official sources.
            </p>
            <div className="mt-3 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Note:</strong> Always cross-check exam-related information with official government notifications.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We may use third-party services like <strong>Google AdSense</strong> and <strong>Google Analytics</strong>. These services may use cookies and collect user data for ads and analytics.
            </p>
          </section>

          {/* External Links */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. External Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to other websites. We are not responsible for their content, policies, or practices. Use external links at your own risk.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              We are not responsible for any loss, damage, or inconvenience caused by using our website content. The website is provided "as is" without warranties of any kind.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms and Conditions anytime without prior notice. Continued use of the website constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* User Consent */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. User Consent</h2>
            <p className="text-gray-600 leading-relaxed">
              By using this website, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the website.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us:
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
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
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
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
