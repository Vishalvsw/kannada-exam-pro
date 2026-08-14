import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const metadata = {
  title: 'Disclaimer - Kannada Exam Pro',
  description: 'Read the complete disclaimer for Kannada Exam Pro. Important information about content accuracy, educational purpose, and liability.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">⚖️ Disclaimer</h1>
          <p className="text-yellow-100 text-sm mt-1">Last Updated: August 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">📑 Table of Contents</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#general" className="text-blue-600 hover:underline">1. General Disclaimer</a>
              <a href="#educational" className="text-blue-600 hover:underline">2. Educational Purpose</a>
              <a href="#accuracy" className="text-blue-600 hover:underline">3. Content Accuracy</a>
              <a href="#external" className="text-blue-600 hover:underline">4. External Links</a>
              <a href="#exam-preparation" className="text-blue-600 hover:underline">5. Exam Preparation</a>
              <a href="#liability" className="text-blue-600 hover:underline">6. Limitation of Liability</a>
              <a href="#user-responsibility" className="text-blue-600 hover:underline">7. User Responsibility</a>
              <a href="#no-endorsement" className="text-blue-600 hover:underline">8. No Endorsement</a>
              <a href="#changes" className="text-blue-600 hover:underline">9. Changes to Disclaimer</a>
              <a href="#contact" className="text-blue-600 hover:underline">10. Contact Us</a>
            </div>
          </div>

          {/* 1. General Disclaimer */}
          <section id="general" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. General Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The information provided on <strong>Kannada Exam Pro</strong> (https://www.kannadaexampro.com) is for general informational and educational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Website, you agree to this disclaimer. If you do not agree, please do not use our Website.
            </p>
          </section>

          {/* 2. Educational Purpose */}
          <section id="educational" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Educational Purpose</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The content provided on Kannada Exam Pro is for <strong>educational and learning purposes only</strong>. While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy of any information provided. Users are encouraged to verify any information independently through official sources.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform is designed to supplement your exam preparation, not to replace official study materials or government notifications.
            </p>
          </section>

          {/* 3. Content Accuracy */}
          <section id="accuracy" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Content Accuracy</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We make every effort to ensure the accuracy of the content on our Website. However, we do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All information is complete, accurate, or current</li>
              <li>Quiz questions reflect actual exam patterns</li>
              <li>Study materials cover all topics comprehensively</li>
              <li>Current affairs are always up-to-date</li>
            </ul>
            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> Always cross-check important information with official government notifications and authorized sources before making any decisions.
              </p>
            </div>
          </section>

          {/* 4. External Links */}
          <section id="external" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. External Links</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them. Users access external links at their own risk.
            </p>
          </section>

          {/* 5. Exam Preparation */}
          <section id="exam-preparation" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Exam Preparation</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Kannada Exam Pro is a <strong>supplementary learning platform</strong>. It is not affiliated with any government organization, recruitment board, examination authority, or educational institution. We do not claim to represent any official body.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Users should:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Refer to official sources for authentic information regarding exams</li>
              <li>Follow official notification guidelines</li>
              <li>Consult with teachers or mentors for personalized guidance</li>
              <li>Use our platform as a practice tool, not as the sole source of preparation</li>
            </ul>
          </section>

          {/* 6. Limitation of Liability */}
          <section id="liability" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              In no event shall Kannada Exam Pro be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Loss of data or profits arising out of, or in connection with, the use of this website</li>
              <li>Any errors or omissions in the content</li>
              <li>Any interruptions or cessation of service</li>
              <li>Any viruses or harmful components transmitted through our Website</li>
              <li>Any unauthorized access to or use of our servers</li>
            </ul>
            <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>⚠️ Liability Disclaimer:</strong> By using this website, you agree that the website owner shall not be held responsible for any loss, error, or consequence resulting from the use of the information provided.
              </p>
            </div>
          </section>

          {/* 7. User Responsibility */}
          <section id="user-responsibility" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. User Responsibility</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You are responsible for your own use of our Website and for any consequences that may arise from your use. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Verify important information independently</li>
              <li>Use the content responsibly and ethically</li>
              <li>Not rely solely on our content for critical decisions</li>
              <li>Consult official sources for authoritative information</li>
              <li>Take responsibility for your own learning outcomes</li>
            </ul>
          </section>

          {/* 8. No Endorsement */}
          <section id="no-endorsement" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. No Endorsement</h2>
            <p className="text-gray-600 leading-relaxed">
              Reference to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise does not necessarily constitute or imply its endorsement, recommendation, or favoring by Kannada Exam Pro. The views and opinions expressed on our Website are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company.
            </p>
          </section>

          {/* 9. Changes to Disclaimer */}
          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update or change this disclaimer at any time without prior notice. Any changes will be effective immediately upon posting on this page. By continuing to use our Website after any changes, you agree to be bound by the revised disclaimer.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have any questions, concerns, or require clarification regarding this disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700"><strong>📧 Email:</strong> <a href="mailto:kannadaexampro@gmail.com" className="text-blue-600 hover:underline">kannadaexampro@gmail.com</a></p>
              <p className="text-gray-700 mt-2"><strong>🌐 Website:</strong> <a href="https://www.kannadaexampro.com" className="text-blue-600 hover:underline">www.kannadaexampro.com</a></p>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ Thank You:</strong> Thank you for reading our disclaimer. We are committed to providing you with a safe and enriching learning experience.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Home</Link>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Kannada Exam Pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-yellow-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-yellow-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-yellow-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-500 hover:text-yellow-600 transition">
            <span className="text-xl">📸</span><span className="text-[10px]">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-yellow-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
