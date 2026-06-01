'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Only show footer on home page (/)
  const isHomePage = pathname === '/';
  
  if (!isHomePage) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Kannada Exam Pro</h3>
            <p className="text-sm text-gray-400">Prepare for KAS, PSI, PDO, FDA, SDA exams with interactive quizzes.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Exams</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">KAS - Karnataka Administrative Service</li>
              <li className="text-gray-400">PSI - Police Sub-Inspector</li>
              <li className="text-gray-400">PDO - Panchayat Development Officer</li>
              <li className="text-gray-400">FDA/SDA - First/Second Division Assistant</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Follow Us</h3>
            <div className="flex gap-4 mb-4">
              <a href="https://www.instagram.com/kannada_exam_pro" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-pink-400 transition">📸</a>
              <a href="#" className="text-2xl hover:text-blue-400 transition">👍</a>
              <a href="#" className="text-2xl hover:text-red-400 transition">❤️</a>
            </div>
            <p className="text-sm text-gray-400">© 2024 Kannada Exam Pro</p>
            <p className="text-xs text-gray-500 mt-1">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
