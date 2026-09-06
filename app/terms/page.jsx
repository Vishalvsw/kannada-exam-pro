import AdSenseBanner from "@/components/AdSenseBanner";
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - Kannada Exam Pro',
  description: 'Read the complete terms and conditions for using Kannada Exam Pro website. Learn about user obligations, content usage, and legal disclaimers.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ✅ AdSense Banner - Bottom of Quiz */}
                  <div className="max-w-md mx-auto px-4">
                    <AdSenseBanner 
                      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_QUIZ_BOTTOM}
                      className="mt-2"
                    />
                  </div>
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">📜 Terms & Conditions</h1>
          <p className="text-purple-100 text-sm mt-1">Last Updated: August 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">📑 Table of Contents</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <a href="#introduction" className="text-blue-600 hover:underline">1. Introduction</a>
              <a href="#acceptance" className="text-blue-600 hover:underline">2. Acceptance of Terms</a>
              <a href="#user-accounts" className="text-blue-600 hover:underline">3. User Accounts</a>
              <a href="#content" className="text-blue-600 hover:underline">4. Content & Intellectual Property</a>
              <a href="#user-conduct" className="text-blue-600 hover:underline">5. User Conduct</a>
              <a href="#quiz-rules" className="text-blue-600 hover:underline">6. Quiz Rules</a>
              <a href="#privacy" className="text-blue-600 hover:underline">7. Privacy & Data</a>
              <a href="#third-party" className="text-blue-600 hover:underline">8. Third-Party Services</a>
              <a href="#limitation" className="text-blue-600 hover:underline">9. Limitation of Liability</a>
              <a href="#indemnification" className="text-blue-600 hover:underline">10. Indemnification</a>
              <a href="#termination" className="text-blue-600 hover:underline">11. Termination</a>
              <a href="#changes" className="text-blue-600 hover:underline">12. Changes to Terms</a>
              <a href="#contact" className="text-blue-600 hover:underline">13. Contact Us</a>
            </div>
          </div>

          {/* 1. Introduction */}
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Welcome to <strong>Kannada Exam Pro</strong> (hereinafter referred to as "we," "our," or "the Website"). These Terms and Conditions ("Terms") govern your use of our website located at <strong>https://www.kannadaexampro.com</strong> and all associated services, features, and content provided by Kannada Exam Pro.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              By accessing or using our Website, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you must immediately discontinue your use of our Website.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms constitute a legally binding agreement between you and Kannada Exam Pro. Please read them carefully before using our services.
            </p>
          </section>

          {/* 2. Acceptance of Terms */}
          <section id="acceptance" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By using Kannada Exam Pro, you acknowledge that you have read, understood, and agree to be bound by these Terms. You also agree to comply with all applicable local, state, national, and international laws and regulations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you are using our Website on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. You may not use our Website if you are under the age of 13, or if you are prohibited from using such services under applicable laws.
            </p>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> By continuing to use our Website, you automatically accept these Terms. If you do not agree, please stop using the Website immediately.
              </p>
            </div>
          </section>

          {/* 3. User Accounts */}
          <section id="user-accounts" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-bold text-gray-700 mb-3">3.1 Registration</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              To access certain features of our Website, you may be required to create a user account. When registering, you agree to provide accurate, current, and complete information about yourself. You are solely responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h3 className="text-xl font-bold text-gray-700 mb-3">3.2 Account Security</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              You are responsible for all activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Maintain the security and confidentiality of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Ensure that you log out from your account at the end of each session</li>
              <li>Not share your account credentials with any third party</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-700 mb-3">3.3 Account Termination</h3>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, if we believe that you have violated these Terms or engaged in any fraudulent, abusive, or illegal activity.
            </p>
          </section>

          {/* 4. Content & Intellectual Property */}
          <section id="content" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Content & Intellectual Property</h2>
            
            <h3 className="text-xl font-bold text-gray-700 mb-3">4.1 Our Content</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              All content on Kannada Exam Pro, including but not limited to quiz questions, study materials, notes, current affairs articles, images, graphics, logos, text, and software, is the exclusive property of Kannada Exam Pro or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Copy, reproduce, distribute, or republish any content from our Website without prior written consent</li>
              <li>Modify, create derivative works from, or reverse engineer any portion of our Website</li>
              <li>Use our content for commercial purposes without explicit authorization</li>
              <li>Remove any copyright or proprietary notices from our content</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-700 mb-3">4.2 User-Generated Content</h3>
            <p className="text-gray-600 leading-relaxed">
              By submitting any content to our Website (including comments, feedback, or quiz responses), you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content in connection with our services. You retain ownership of your original content.
            </p>
          </section>

          {/* 5. User Conduct */}
          <section id="user-conduct" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree to use our Website responsibly and not to engage in any prohibited activities, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Academic Dishonesty:</strong> Cheating, sharing answers, or manipulating quiz results</li>
              <li><strong>Unauthorized Access:</strong> Attempting to access restricted areas or other users' accounts</li>
              <li><strong>Harmful Content:</strong> Posting offensive, defamatory, or abusive content</li>
              <li><strong>Automated Tools:</strong> Using bots, scrapers, or automated tools to extract data</li>
              <li><strong>Disruption:</strong> Interfering with the operation of our Website or servers</li>
              <li><strong>Misrepresentation:</strong> Impersonating others or providing false information</li>
            </ul>
            <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>⚠️ Violation Warning:</strong> Any violation of these rules may result in immediate account suspension, legal action, and reporting to relevant authorities.
              </p>
            </div>
          </section>

          {/* 6. Quiz Rules */}
          <section id="quiz-rules" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Quiz Rules</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our quiz system is designed for educational and competitive purposes. By participating in quizzes, you agree to the following rules:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Quizzes are for individual participation only</li>
              <li>You may not share quiz questions or answers with others</li>
              <li>All quiz responses must be your own work</li>
              <li>Results are determined based on accuracy and response time</li>
              <li>We reserve the right to adjust or remove quiz scores if we detect manipulation</li>
              <li>Leaderboard rankings are based on cumulative performance</li>
            </ul>
          </section>

          {/* 7. Privacy & Data */}
          <section id="privacy" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Privacy & Data</h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Please refer to our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> for detailed information about how we collect, use, and protect your personal data. By using our Website, you consent to the collection and use of your data as described in our Privacy Policy.
            </p>
          </section>

          {/* 8. Third-Party Services */}
          <section id="third-party" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our Website may contain links to third-party websites, advertisements, or services that are not owned or controlled by Kannada Exam Pro. We do not endorse, assume responsibility for, or make any representations about the content, privacy practices, or policies of such third-party sites.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
              <li><strong>Google Analytics:</strong> For tracking website usage and improving user experience</li>
              <li><strong>Vercel:</strong> For website hosting and deployment</li>
            </ul>
          </section>

          {/* 9. Limitation of Liability */}
          <section id="limitation" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To the maximum extent permitted by law, Kannada Exam Pro and its affiliates, officers, directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your use or inability to use our Website</li>
              <li>Any errors, inaccuracies, or omissions in our content</li>
              <li>Any unauthorized access to or use of our servers and data</li>
              <li>Any interruption or cessation of our services</li>
              <li>Any bugs, viruses, or harmful components transmitted through our Website</li>
              <li>Any loss of data, profits, or business opportunities</li>
            </ul>
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>📌 Note:</strong> Our Website is provided "as is" and "as available" without warranties of any kind, either express or implied.
              </p>
            </div>
          </section>

          {/* 10. Indemnification */}
          <section id="indemnification" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Kannada Exam Pro and its affiliates from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney's fees) arising out of or related to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Your use of our Website in violation of these Terms</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Your infringement of any third-party rights</li>
              <li>Any content you submit or transmit through our Website</li>
            </ul>
          </section>

          {/* 11. Termination */}
          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We reserve the right to terminate or suspend your account and access to our Website at any time, with or without cause, and with or without notice. Grounds for termination may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violation of these Terms or any other policies</li>
              <li>Engaging in fraudulent or illegal activities</li>
              <li>Abusing our services or disrupting other users</li>
              <li>Failure to comply with applicable laws</li>
            </ul>
          </section>

          {/* 12. Changes to Terms */}
          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may revise these Terms at any time without prior notice. The updated Terms will be posted on this page with the "Last Updated" date. Your continued use of our Website after any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* 13. Contact Us */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700"><strong>📧 Email:</strong> <a href="mailto:kannadaexampro@gmail.com" className="text-blue-600 hover:underline">kannadaexampro@gmail.com</a></p>
              <p className="text-gray-700 mt-2"><strong>🌐 Website:</strong> <a href="https://www.kannadaexampro.com" className="text-blue-600 hover:underline">www.kannadaexampro.com</a></p>
              <p className="text-gray-700 mt-2"><strong>📱 Instagram:</strong> <a href="https://instagram.com/kannadaexampro" target="_blank" className="text-blue-600 hover:underline">@kannadaexampro</a></p>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ Thank You:</strong> Thank you for reading our Terms & Conditions. We are committed to providing you with a safe and enriching learning experience.
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

      <AdSenseBanner adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} className="mx-4 mt-8 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📸</span><span className="text-[10px]">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
