'use client';

import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
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
              Welcome to <strong>Kannada Exam Pro</strong> (kannadaexampro.com). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our website.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              By using our website, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">We may collect the following information:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
              <li><strong>Name</strong> – When you register or contact us</li>
              <li><strong>Instagram ID</strong> – Used for identification and leaderboard</li>
              <li><strong>Email address</strong> – If you contact us via email</li>
              <li><strong>Quiz data</strong> – Your quiz scores, progress, and attempts</li>
              <li><strong>Browser & device info</strong> – Browser type, device type, and operating system</li>
              <li><strong>IP address</strong> – For analytics and security</li>
              <li><strong>Cookies</strong> – For website functionality and analytics</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
              <li>Provide and maintain our quiz platform</li>
              <li>Display leaderboard rankings</li>
              <li>Improve website content and user experience</li>
              <li>Respond to your queries and feedback</li>
              <li>Analyze website performance and traffic</li>
              <li>Maintain website security</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to improve functionality, understand user behavior, and show relevant ads. You can control cookie settings in your browser.
            </p>
            <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>📌 Note:</strong> Disabling cookies may affect your experience on our website.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We use third-party services like <strong>Google AdSense</strong> and <strong>Google Analytics</strong>. These services may use cookies to show personalized ads and analyze website traffic.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">📊 Google Analytics</p>
                <p className="text-xs text-blue-600">Analytics & performance tracking</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-sm font-semibold text-green-800">📢 Google AdSense</p>
                <p className="text-xs text-green-600">Personalized ad display</p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Data Protection</h2>
            <p className="text-gray-600 leading-relaxed">
              We take reasonable security measures to protect your personal data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          {/* External Links */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to external websites. We are not responsible for the privacy practices of these websites. Please read their privacy policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not knowingly collect personal data from children under 13 years of age. If you are a parent or guardian and believe your child has provided personal information, please contact us.
            </p>
          </section>

          {/* Consent */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Your Consent</h2>
            <p className="text-gray-600 leading-relaxed">
              By using our website, you consent to our Privacy Policy. If you do not agree with this policy, please do not use our website.
            </p>
          </section>

          {/* Data Deletion */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Data Deletion Request</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to request deletion of your personal data. To request data deletion, please contact us with your Instagram ID and email address.
            </p>
            <div className="mt-3 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Note:</strong> Deleting your data will remove your quiz history and leaderboard entries. This action cannot be undone.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
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
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🎯</span>
            <span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📖</span>
            <span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📰</span>
            <span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏆</span>
            <span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">👤</span>
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
