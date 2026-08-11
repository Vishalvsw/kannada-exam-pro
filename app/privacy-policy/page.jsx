'use client';

import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-blue-100 text-sm mt-1">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Quick Navigation */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">📑 Quick Navigation</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#introduction" className="text-blue-600 hover:underline">Introduction</a>
              <a href="#collection" className="text-blue-600 hover:underline">Information Collection</a>
              <a href="#usage" className="text-blue-600 hover:underline">How We Use Data</a>
              <a href="#cookies" className="text-blue-600 hover:underline">Cookies</a>
              <a href="#third-party" className="text-blue-600 hover:underline">Third-Party Services</a>
              <a href="#protection" className="text-blue-600 hover:underline">Data Protection</a>
              <a href="#deletion" className="text-blue-600 hover:underline">Data Deletion</a>
              <a href="#contact" className="text-blue-600 hover:underline">Contact Us</a>
            </div>
          </div>
          
          {/* Introduction */}
          <section id="introduction" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to <strong>Kannada Exam Pro</strong> (kannadaexampro.com). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              By using Kannada Exam Pro, you agree to the collection and use of information in accordance with this policy. If you do not agree with any part of this policy, please do not use our services.
            </p>
            <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>📌 Key Point:</strong> We collect only the minimum information needed to provide you with a personalized quiz experience and maintain fair leaderboard rankings.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="collection" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect the following types of information to provide and improve our services:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">📝 Personal Information</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                  <li><strong>Name</strong> – For personalization and leaderboard display</li>
                  <li><strong>Instagram ID</strong> – Primary identifier for your account</li>
                  <li><strong>Email Address</strong> – For communication and account recovery</li>
                  <li><strong>Profile Image</strong> – Optional profile picture from Instagram</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">📊 Usage Data</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                  <li><strong>Quiz Scores</strong> – Track your progress and performance</li>
                  <li><strong>Quiz History</strong> – Past quiz attempts and results</li>
                  <li><strong>Time Spent</strong> – Time taken on each quiz</li>
                  <li><strong>Subject Preferences</strong> – Topics you study most</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">🖥️ Technical Data</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                  <li><strong>IP Address</strong> – For analytics and security</li>
                  <li><strong>Browser Type</strong> – Browser and version information</li>
                  <li><strong>Device Type</strong> – Desktop, mobile, or tablet</li>
                  <li><strong>Operating System</strong> – OS and version</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">🍪 Cookie Data</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                  <li><strong>Session Cookies</strong> – Maintain your login session</li>
                  <li><strong>Preference Cookies</strong> – Remember your settings</li>
                  <li><strong>Analytics Cookies</strong> – Track website usage</li>
                  <li><strong>Ad Cookies</strong> – Display relevant advertisements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section id="usage" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Your information helps us provide a better learning experience:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Personalized Learning:</strong> Track your progress and recommend relevant quizzes</li>
              <li><strong>Leaderboard:</strong> Display fair rankings based on quiz performance</li>
              <li><strong>Content Improvement:</strong> Identify which topics need more study materials</li>
              <li><strong>User Support:</strong> Respond to your queries and feedback</li>
              <li><strong>Analytics:</strong> Understand how users interact with our platform</li>
              <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
            </ul>
            <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ We DO NOT:</strong> Sell your personal information to third parties, share your data without consent, or use your data for unauthorized purposes.
              </p>
            </div>
          </section>

          {/* Legal Basis for Processing */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Legal Basis for Processing</h2>
            <p className="text-gray-600 leading-relaxed">
              We process your personal information based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li><strong>Consent:</strong> You provide consent when you register and use our services</li>
              <li><strong>Contract:</strong> Processing is necessary to provide the services you request</li>
              <li><strong>Legitimate Interest:</strong> We have a legitimate interest in improving our platform</li>
              <li><strong>Legal Obligation:</strong> We may process data to comply with applicable laws</li>
            </ul>
          </section>

          {/* Cookies */}
          <section id="cookies" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to improve functionality, analyze usage, and display relevant advertisements. Cookies are small text files stored on your device.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800">🔑 Essential</h4>
                <p className="text-xs text-blue-600">Required for basic website functionality</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800">📊 Analytics</h4>
                <p className="text-xs text-purple-600">Help us understand user behavior</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <h4 className="text-sm font-semibold text-green-800">📢 Advertising</h4>
                <p className="text-xs text-green-600">Show relevant ads from Google AdSense</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mt-3">
              You can control cookie settings in your browser preferences. However, disabling cookies may affect certain features of our website.
            </p>
          </section>

          {/* Third-Party Services */}
          <section id="third-party" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We use trusted third-party services to enhance our platform. These services have their own privacy policies:
            </p>
            <div className="mt-3 space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📢 Google AdSense</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Used to display relevant advertisements. Google may use cookies to personalize ads based on your interests.
                </p>
                <a href="https://policies.google.com/privacy" target="_blank" className="text-xs text-blue-600 hover:underline">
                  View Google's Privacy Policy →
                </a>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📊 Google Analytics</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Helps us understand how visitors interact with our website and improve user experience.
                </p>
                <a href="https://policies.google.com/privacy" target="_blank" className="text-xs text-blue-600 hover:underline">
                  View Google's Privacy Policy →
                </a>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📦 Vercel (Hosting)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Our website is hosted on Vercel. They may collect technical data for performance and security.
                </p>
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" className="text-xs text-blue-600 hover:underline">
                  View Vercel's Privacy Policy →
                </a>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section id="protection" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Data Protection & Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li><strong>Encryption:</strong> All data is encrypted in transit using SSL/TLS</li>
              <li><strong>Access Control:</strong> Only authorized personnel have access to user data</li>
              <li><strong>Regular Audits:</strong> We conduct security audits to identify vulnerabilities</li>
              <li><strong>Secure Storage:</strong> Data is stored on secure, cloud-based infrastructure</li>
            </ul>
            <div className="mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> While we take all reasonable precautions, no method of data transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as your account is active and for a reasonable period thereafter to comply with legal obligations.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li><strong>Quiz Data:</strong> Retained to show your progress and history</li>
              <li><strong>Account Information:</strong> Retained until you request deletion</li>
              <li><strong>Analytics Data:</strong> Anonymized and retained for trend analysis</li>
            </ul>
          </section>

          {/* Data Deletion */}
          <section id="deletion" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Data Deletion Request</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to request deletion of your personal data at any time. To request data deletion:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li>Contact us using the email below</li>
              <li>Provide your Instagram ID and registered email</li>
              <li>Specify the data you want deleted</li>
            </ol>
            <div className="mt-3 bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>⚠️ Important Note:</strong> Deleting your data will permanently remove your quiz history, leaderboard entries, and account information. This action cannot be undone.
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
              <li><strong>Right to Restriction:</strong> Limit processing of your data</li>
              <li><strong>Right to Object:</strong> Object to certain data processing activities</li>
              <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Kannada Exam Pro is intended for use by individuals aged 13 and above. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided personal information, please contact us immediately so we can delete such information.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">12. International Users</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website is hosted in India and primarily serves users in India. If you are accessing our platform from outside India, please note that your data may be transferred to and processed in India. By using our services, you consent to such transfer.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">13. Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for registered users)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact */}
          <section id="contact">
            <h2 className="text-xl font-bold text-gray-800 mb-3">14. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">
                  <strong>📧 Email:</strong> 
                  <a href="mailto:kannadaexampro@gmail.com" className="text-blue-600 hover:underline ml-1">
                    kannadaexampro@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>🌐 Website:</strong> 
                  <a href="https://kannadaexampro.com" className="text-blue-600 hover:underline ml-1">
                    kannadaexampro.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>📱 Instagram:</strong>
                  <a href="https://instagram.com/kannadaexampro" target="_blank" className="text-blue-600 hover:underline ml-1">
                    @kannadaexampro
                  </a>
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>⏱️ Response Time:</strong> We typically respond to privacy-related inquiries within 24-48 hours.
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  <strong>📌 Include:</strong> When contacting us about your data, please include your Instagram ID and registered email address for verification.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <div className="space-x-4">
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  ← Back to Home
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                  Terms of Service
                </Link>
                <Link href="/disclaimer" className="text-gray-500 hover:text-gray-700 text-sm">
                  Disclaimer
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-2 md:mt-0">
                © {new Date().getFullYear()} Kannada Exam Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🎯</span>
            <span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📖</span>
            <span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📰</span>
            <span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏆</span>
            <span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">👤</span>
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}