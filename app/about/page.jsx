import Link from 'next/link';
import AdSenseBanner from '@/components/AdSpace';

export const metadata = {
  title: 'About Us - Kannada Exam Pro | Our Mission & Vision',
  description: 'Learn about Kannada Exam Pro - a free platform for Karnataka competitive exam preparation. Our mission, vision, values, and commitment to helping aspirants succeed.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSenseBanner className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">📖 About Us</h1>
          <p className="text-green-100 text-sm mt-1">Empowering aspirants for Karnataka competitive exams</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Mission */}
          <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To democratize exam preparation by providing free, high-quality study materials 
              and practice tools for all Karnataka state-level competitive exam aspirants, 
              regardless of their financial background.
            </p>
          </div>

          {/* Vision */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👁️ Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where every aspiring candidate has equal access to quality 
              exam preparation resources. Through technology and community-driven content, 
              we aim to level the playing field and help thousands of students achieve their 
              dreams of government service.
            </p>
          </section>

          {/* Values */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💎 Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-bold text-gray-800">Quality Education</h3>
                <p className="text-sm text-gray-600 mt-2">We provide accurate, up-to-date, and comprehensive study materials.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-bold text-gray-800">Community First</h3>
                <p className="text-sm text-gray-600 mt-2">We believe in collaborative learning and community support.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">🔓</div>
                <h3 className="font-bold text-gray-800">Accessibility</h3>
                <p className="text-sm text-gray-600 mt-2">Education should be free and accessible to all, without barriers.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-bold text-gray-800">Innovation</h3>
                <p className="text-sm text-gray-600 mt-2">We use technology to make learning engaging and effective.</p>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800">Interactive Quizzes</h3>
                <p className="text-sm text-gray-600 mt-2">Practice with our comprehensive quiz system covering all exam subjects.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">📖</div>
                <h3 className="font-bold text-gray-800">Study Notes</h3>
                <p className="text-sm text-gray-600 mt-2">Access curated notes for quick revision and in-depth study.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">📰</div>
                <h3 className="font-bold text-gray-800">Current Affairs</h3>
                <p className="text-sm text-gray-600 mt-2">Stay updated with daily current affairs relevant to Karnataka exams.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-bold text-gray-800">Leaderboard</h3>
                <p className="text-sm text-gray-600 mt-2">Compete with other aspirants and track your progress.</p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ Why Choose Kannada Exam Pro</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div><strong>100% Free</strong> - No hidden costs, completely free for all students</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div><strong>Updated Content</strong> - Regular updates based on exam patterns</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div><strong>Kannada Medium</strong> - Content in Kannada for better understanding</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div><strong>Interactive Learning</strong> - Quizzes and tests for better retention</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div><strong>Progress Tracking</strong> - Monitor your performance and growth</div>
              </li>
            </ul>
          </section>

          {/* Team */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Our Team</h2>
            <p className="text-gray-600 leading-relaxed">
              Kannada Exam Pro is built by a team of passionate educators, technology enthusiasts, 
              and social workers who believe in the power of education to transform lives. We are 
              committed to providing the best learning experience for every aspirant.
            </p>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Your Preparation?</h3>
            <p className="text-green-100 mb-4">Join thousands of aspirants already using Kannada Exam Pro</p>
            <Link href="/quiz" className="inline-block bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
              Start Practicing Now →
            </Link>
          </div>

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
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📸</span><span className="text-[10px]">Gallery</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
