'use client';

import Link from 'next/link';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-800">Disclaimer</h1>
          <p className="text-gray-500 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        {/* Content */}
        <div className="space-y-5 text-gray-600">
          <p className="text-sm">
            The information provided on this website is for educational and informational purposes only.
          </p>

          <p className="text-sm">
            We make every effort to ensure that the content, including MCQs, Current Affairs, Notes, 
            and other study materials, is accurate and up to date. However, we do not guarantee the 
            completeness, accuracy, reliability, or suitability of any information provided.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>📢 Important Note:</strong> This website is not affiliated with, endorsed by, 
              or connected to any government organization, recruitment board, examination authority, 
              or educational institution.
            </p>
          </div>

          <p className="text-sm">
            Users are advised to verify important information through official government notifications, 
            websites, and authorized sources before making any decisions.
          </p>

          <p className="text-sm">
            The quizzes, leaderboards, notes, and study materials available on this website are intended 
            solely for learning, practice, and exam preparation purposes.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-sm text-red-800">
              <strong>⚠️ Liability Disclaimer:</strong> By using this website, you agree that the 
              website owner shall not be held responsible for any loss, error, or consequence resulting 
              from the use of the information provided.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="text-sm text-green-800">
              <strong>🙏 Thank You:</strong> Thank you for using our platform and supporting quality 
              education for all students.
            </p>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t flex justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-700 transition">
            ← Back to Home
          </Link>
          <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 transition">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}