import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const metadata = {
  title: 'Terms & Conditions - Kannada Exam Pro',
  description: 'Read the terms and conditions for using Kannada Exam Pro website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-center">📜 Terms & Conditions</h1>
        <p className="text-purple-100 text-center mt-2">Please read these terms carefully</p>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p><strong>Last Updated:</strong> July 2026</p>
            <p>By using <strong>Kannada Exam Pro</strong>, you agree to these terms and conditions.</p>
            <h3 className="text-xl font-bold text-gray-800">Acceptance of Terms</h3>
            <p>By accessing and using this website, you accept and agree to be bound by these terms.</p>
            <h3 className="text-xl font-bold text-gray-800">User Account</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old to use this website</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You agree to provide accurate and complete information</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-800">Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All content is for educational purposes only</li>
              <li>You may not copy, reproduce, or distribute content without permission</li>
              <li>We reserve the right to modify or remove content at any time</li>
            </ul>
            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-purple-700 text-sm text-center">📧 For any questions, contact us at: <strong>support@kannadaexampro.com</strong></p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Privacy Policy</Link>
            <Link href="/disclaimer" className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition">Disclaimer</Link>
            <Link href="/" className="bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Home</Link>
          </div>
        </div>
      </div>
      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />
    </div>
  );
}
