import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Kannada Exam Pro',
  description: 'Read the privacy policy for Kannada Exam Pro.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">🔒 Privacy Policy</h1>
          <p className="text-blue-100 text-sm mt-1">How we handle your data</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600">Privacy policy content goes here.</p>
          <div className="mt-8 text-center">
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
