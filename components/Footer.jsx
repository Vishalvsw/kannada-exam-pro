'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Kannada Exam Pro
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted platform for KAS, PSI, PDO, FDA, SDA exam preparation in Karnataka.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Disclaimer</h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-400 space-y-2">
              <p>
                The information provided on this website is for <strong>educational and informational purposes only</strong>.
              </p>
              <p>
                We make every effort to ensure that the content, including MCQs, Current Affairs, Notes, and other study materials, 
                is accurate and up to date. However, we do not guarantee the completeness, accuracy, reliability, or suitability 
                of any information provided.
              </p>
              <p>
                This website is <strong>not affiliated with, endorsed by, or connected to</strong> any government organization, 
                recruitment board, examination authority, or educational institution.
              </p>
              <p>
                Users are advised to verify important information through official government notifications, websites, 
                and authorized sources before making any decisions.
              </p>
              <p>
                The quizzes, leaderboards, notes, and study materials available on this website are intended solely 
                for <strong>learning, practice, and exam preparation purposes</strong>.
              </p>
              <p>
                By using this website, you agree that the website owner shall not be held responsible for any loss, error, 
                or consequence resulting from the use of the information provided.
              </p>
              <p className="pt-2 font-medium">
                Thank you for using our platform and supporting quality education for all students. 📚
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>&copy; {new Date().getFullYear()} Kannada Exam Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
