import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const metadata = {
  title: 'Disclaimer - Kannada Exam Pro',
  description: 'Read the disclaimer for Kannada Exam Pro website and its content.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-5 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-center">⚖️ Disclaimer</h1>
        <p className="text-yellow-100 text-center mt-2">Important information about our content</p>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>The information provided on <strong>Kannada Exam Pro</strong> is for general informational and educational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind.</p>
            <h3 className="text-xl font-bold text-gray-800">Educational Purpose</h3>
            <p>The content provided is for educational and learning purposes only. Users are encouraged to verify any information independently.</p>
            <h3 className="text-xl font-bold text-gray-800">External Links</h3>
            <p>Our website may contain links to external websites. We do not guarantee the accuracy of any information on these external websites.</p>
            <h3 className="text-xl font-bold text-gray-800">Exam Preparation</h3>
            <p>Kannada Exam Pro is a supplementary learning platform. It is not affiliated with any government organization or exam conducting body.</p>
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-yellow-700 text-sm text-center">⚠️ By using this website, you agree to this disclaimer.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Privacy Policy</Link>
            <Link href="/terms" className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">Terms & Conditions</Link>
            <Link href="/" className="bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Home</Link>
          </div>
        </div>
      </div>
      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />
    </div>
  );
}
