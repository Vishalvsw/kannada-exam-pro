'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
            <p className="text-gray-600">We collect information you provide directly to us, such as when you create an account, take quizzes, or contact us. This includes your Instagram ID, quiz scores, and progress data.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
            <p className="text-gray-600">We use your information to provide and maintain our quiz platform, display leaderboard rankings, and improve user experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Contact Us</h2>
            <p className="text-gray-600">If you have questions, contact us at: <strong>privacy@kannadaexampro.com</strong></p>
          </section>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-blue-600 hover:text-blue-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
