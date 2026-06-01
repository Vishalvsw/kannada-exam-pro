'use client';

import Link from 'next/link';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
        <p className="text-gray-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-600">By accessing and using Kannada Exam Pro, you agree to be bound by these Terms & Conditions.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. User Accounts</h2>
            <p className="text-gray-600">You are responsible for maintaining the confidentiality of your account and providing accurate information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Prohibited Activities</h2>
            <p className="text-gray-600">You may not share answers, cheat on quizzes, or attempt to gain unauthorized access.</p>
          </section>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-blue-600 hover:text-blue-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
