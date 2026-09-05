import Link from 'next/link';
import AdSenseBanner from '@/components/AdSenseBanner';

export const metadata = {
  title: 'Privacy Policy - Kannada Exam Pro',
  description: 'Read the complete privacy policy for Kannada Exam Pro. Learn how we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSenseBanner className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">🔒 Privacy Policy</h1>
          <p className="text-blue-100 text-sm mt-1">Last Updated: August 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">📑 Table of Contents</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#introduction" className="text-blue-600 hover:underline">1. Introduction</a>
              <a href="#information" className="text-blue-600 hover:underline">2. Information We Collect</a>
              <a href="#usage" className="text-blue-600 hover:underline">3. How We Use Your Data</a>
              <a href="#cookies" className="text-blue-600 hover:underline">4. Cookies</a>
              <a href="#third-party" className="text-blue-600 hover:underline">5. Third-Party Services</a>
              <a href="#security" className="text-blue-600 hover:underline">6. Data Security</a>
              <a href="#retention" className="text-blue-600 hover:underline">7. Data Retention</a>
              <a href="#deletion" className="text-blue-600 hover:underline">8. Data Deletion</a>
              <a href="#rights" className="text-blue-600 hover:underline">9. Your Rights</a>
              <a href="#children" className="text-blue-600 hover:underline">10. Children's Privacy</a>
              <a href="#updates" className="text-blue-600 hover:underline">11. Updates to Policy</a>
              <a href="#contact" className="text-blue-600 hover:underline">12. Contact Us</a>
            </div>
          </div>

          {/* 1. Introduction */}
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              At <strong>Kannada Exam Pro</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website <strong>https://www.kannadaexampro.com</strong> and use our services.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              We are committed to protecting your personal data and ensuring transparency in our data practices. This policy applies to all users of our Website, including visitors, registered users, and anyone who interacts with our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Website, you consent to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section id="information" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-bold text-gray-700 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you register, use our services, or contact us, we may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Name:</strong> To personalize your experience and display on leaderboard</li>
              <li><strong>Instagram ID:</strong> As your primary identifier for account and leaderboard</li>
              <li><strong>Email Address:</strong> For communication, account recovery, and notifications</li>
              <li><strong>Profile Image:</strong> Optional photo from Instagram for your profile</li>
              <li><strong>Quiz Data:</strong> Your quiz scores, attempts, and progress</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-700 mb-3 mt-4">2.2 Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you visit our Website, we automatically collect certain technical information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>IP Address:</strong> For analytics and security</li>
              <li><strong>Browser Type:</strong> Browser name, version, and settings</li>
              <li><strong>Device Information:</strong> Device type, operating system, and screen resolution</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, and interactions</li>
              <li><strong>Referring URLs:</strong> How you arrived at our Website</li>
            </ul>

            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>📌 Note:</strong> We collect only the minimum information necessary to provide you with a personalized learning experience.
              </p>
            </div>
          </section>

          {/* 3. How We Use Your Data */}
          <section id="usage" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use your personal information for the following purposes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">📚 Educational Services</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-4">
                  <li>Provide personalized quiz recommendations</li>
                  <li>Track your learning progress</li>
                  <li>Display leaderboard rankings</li>
                  <li>Generate performance reports</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">🔧 Website Improvement</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-4">
                  <li>Analyze usage patterns</li>
                  <li>Identify content gaps</li>
                  <li>Improve user experience</li>
                  <li>Fix technical issues</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">📢 Communication</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-4">
                  <li>Send important notifications</li>
                  <li>Respond to inquiries</li>
                  <li>Share updates about new features</li>
                  <li>Send quiz results</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">🛡️ Security</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-4">
                  <li>Prevent fraud and abuse</li>
                  <li>Detect unauthorized access</li>
                  <li>Ensure data integrity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ We Do NOT:</strong> Sell your personal information to third parties, share your data without consent, or use your data for unauthorized purposes.
              </p>
            </div>
          </section>

          {/* 4. Cookies */}
          <section id="cookies" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your experience on our Website. Cookies are small text files stored on your device that help us remember your preferences and understand how you interact with our content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800">🔑 Essential Cookies</h4>
                <p className="text-sm text-blue-700 mt-1">Required for basic website functionality. Cannot be disabled.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800">📊 Analytics Cookies</h4>
                <p className="text-sm text-purple-700 mt-1">Help us understand user behavior and improve our content.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800">📢 Advertising Cookies</h4>
                <p className="text-sm text-green-700 mt-1">Used to display relevant ads from Google AdSense.</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">
              You can manage your cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our Website.
            </p>
          </section>

          {/* 5. Third-Party Services */}
          <section id="third-party" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use trusted third-party services to enhance our platform. These services have their own privacy policies:
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📢 Google AdSense</h4>
                <p className="text-sm text-gray-600">Used to display relevant advertisements. Google may use cookies to personalize ads based on your interests.</p>
                <a href="https://policies.google.com/privacy" target="_blank" className="text-xs text-blue-600 hover:underline">View Google's Privacy Policy →</a>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📊 Google Analytics</h4>
                <p className="text-sm text-gray-600">Helps us understand how visitors interact with our website and improve user experience.</p>
                <a href="https://policies.google.com/privacy" target="_blank" className="text-xs text-blue-600 hover:underline">View Google's Privacy Policy →</a>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700">📦 Vercel (Hosting)</h4>
                <p className="text-sm text-gray-600">Our website is hosted on Vercel. They may collect technical data for performance and security.</p>
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" className="text-xs text-blue-600 hover:underline">View Vercel's Privacy Policy →</a>
              </div>
            </div>
          </section>

          {/* 6. Data Security */}
          <section id="security" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit using SSL/TLS (HTTPS)</li>
              <li><strong>Access Control:</strong> Only authorized personnel have access to user data</li>
              <li><strong>Regular Audits:</strong> We conduct security audits to identify vulnerabilities</li>
              <li><strong>Secure Storage:</strong> Data is stored on secure, cloud-based infrastructure</li>
              <li><strong>Authentication:</strong> Strong authentication mechanisms for admin access</li>
            </ul>
            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> While we take all reasonable precautions, no method of data transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* 7. Data Retention */}
          <section id="retention" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We retain your personal information for as long as your account is active and for a reasonable period thereafter to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide ongoing services and support</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain historical records for analytics</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              <strong>Quiz Data:</strong> Retained to show your progress and history<br />
              <strong>Account Information:</strong> Retained until you request deletion<br />
              <strong>Analytics Data:</strong> Anonymized and retained for trend analysis
            </p>
          </section>

          {/* 8. Data Deletion */}
          <section id="deletion" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Data Deletion Request</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the right to request deletion of your personal data at any time. To request data deletion:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Contact us using the email below</li>
              <li>Provide your Instagram ID and registered email</li>
              <li>Specify the data you want deleted</li>
              <li>We will respond within 30 days</li>
            </ol>
            <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>⚠️ Important Note:</strong> Deleting your data will permanently remove your quiz history, leaderboard entries, and account information. This action cannot be undone.
              </p>
            </div>
          </section>

          {/* 9. Your Rights */}
          <section id="rights" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Under applicable data protection laws, you have the following rights:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">📖 Right to Access</h4>
                <p className="text-sm text-gray-600">Request a copy of your personal data we hold</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">✏️ Right to Rectification</h4>
                <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">🗑️ Right to Erasure</h4>
                <p className="text-sm text-gray-600">Request deletion of your data (subject to legal obligations)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700">⛔ Right to Restriction</h4>
                <p className="text-sm text-gray-600">Limit processing of your data</p>
              </div>
            </div>
          </section>

          {/* 10. Children's Privacy */}
          <section id="children" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Kannada Exam Pro is intended for use by individuals aged 13 and above. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided personal information, please contact us immediately so we can delete such information.
            </p>
          </section>

          {/* 11. Updates */}
          <section id="updates" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for registered users)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* 12. Contact */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700"><strong>📧 Email:</strong> <a href="mailto:kannadaexampro@gmail.com" className="text-blue-600 hover:underline">kannadaexampro@gmail.com</a></p>
              <p className="text-gray-700 mt-2"><strong>🌐 Website:</strong> <a href="https://www.kannadaexampro.com" className="text-blue-600 hover:underline">www.kannadaexampro.com</a></p>
              <p className="text-gray-700 mt-2"><strong>📱 Instagram:</strong> <a href="https://instagram.com/kannadaexampro" target="_blank" className="text-blue-600 hover:underline">@kannadaexampro</a></p>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ Thank You:</strong> Your privacy matters to us. Thank you for trusting Kannada Exam Pro with your data.
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

      <AdSenseBanner className="mx-4 mt-8 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📸</span><span className="text-[10px]">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
