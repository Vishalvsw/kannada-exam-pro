'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Divider with icon */}
          <div className="flex items-center gap-4 mb-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-lg">📚</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800 tracking-wide">
              NISHANTH SHINDE
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Operated by <span className="text-blue-600">KannadaExamPro</span>
            </p>
            
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <span>✉️</span> kannadaexampro@gmail.com
            </p>
            
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} kannadaexampro. All Rights reserved
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200 w-full max-w-2xl">
            <Link href="/terms" className="hover:text-blue-600 transition">
              Terms & Condition
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/privacy-policy" className="hover:text-blue-600 transition">
              Privacy Policy
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="hover:text-blue-600 transition">
              Contact Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/about" className="hover:text-blue-600 transition">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/disclaimer" className="hover:text-blue-600 transition">
              Disclaimer
            </Link>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-4 mt-3">
            <a 
              href="https://www.instagram.com/kannada_exam_pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition text-xl"
              aria-label="Instagram"
            >
              <span role="img" aria-hidden="true">📸</span>
            </a>
            <a 
              href="https://whatsapp.com/channel/0029VbCnlxq3wtbEGjkxIM2M" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition text-xl"
              aria-label="WhatsApp"
            >
              <span role="img" aria-hidden="true">💬</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}