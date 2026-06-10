'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">Kannada Exam Pro</h3>
            <p className="text-sm text-gray-400">
              Prepare for KAS, PSI, PDO, FDA, SDA exams with interactive quizzes, study notes, and current affairs.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-green-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-green-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-green-400 transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social & Copyright */}
          <div>
            <h3 className="text-lg font-bold mb-3">Follow Us</h3>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://www.instagram.com/kannada_exam_pro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-pink-500 transition"
              >
                📸
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbCnlxq3wtbEGjkxIM2M" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-green-500 transition"
              >
                💬
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Kannada Exam Pro
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Educational purpose only. Not affiliated with government.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}