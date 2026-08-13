import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const metadata = {
  title: 'Privacy Policy - Kannada Exam Pro',
  description: 'Read the privacy policy for Kannada Exam Pro website. Learn how we handle your data.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-center">🔒 Privacy Policy</h1>
        <p className="text-blue-100 text-center mt-2">How we handle your data</p>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p><strong>Last Updated:</strong> July 2026</p>
            <p>At <strong>Kannada Exam Pro</strong>, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.</p>
            <h3 className="text-xl font-bold text-gray-800">Information We Collect</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address (when you contact us)</li>
              <li>Instagram ID (for user authentication)</li>
              <li>Quiz scores and progress</li>
              <li>Browser and device information</li>
              <li>IP address for analytics</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-800">How We Use Your Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our services</li>
              <li>To track quiz progress and show leaderboard</li>
              <li>To analyze website usage and improve content</li>
              <li>To respond to your inquiries</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-700 text-sm text-center">📧 For any privacy concerns, contact us at: <strong>support@kannadaexampro.com</strong></p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/terms" className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">Terms & Conditions</Link>
            <Link href="/disclaimer" className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition">Disclaimer</Link>
            <Link href="/" className="bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Home</Link>
          </div>
        </div>
      </div>
      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />
    </div>
  );
}
