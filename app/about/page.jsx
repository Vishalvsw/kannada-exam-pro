import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const metadata = {
  title: 'About KannadaExamPro | Free Exam Preparation Platform',
  description: 'Learn about KannadaExamPro - a free platform for Karnataka competitive exam preparation. Our mission, vision, and commitment to helping aspirants succeed.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-white/80 hover:text-white mb-4 inline-block">← Back to Home</Link>
          <h1 className="text-3xl font-bold">About KannadaExamPro</h1>
          <p className="text-blue-100 text-sm mt-1">Empowering aspirants for Karnataka competitive exams</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To democratize exam preparation by providing free, high-quality study materials 
              and practice tools for all Karnataka state-level competitive exam aspirants.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👁️ Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where every aspiring candidate has equal access to quality 
              exam preparation resources through technology and community-driven content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-4">
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

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Start Your Preparation?</h3>
            <Link href="/quiz" className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
              Start Practicing Now →
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span></Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">📖</span><span className="text-[10px]">Study</span></Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">📰</span><span className="text-[10px]">Current</span></Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">🏆</span><span className="text-[10px]">Rank</span></Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition"><span className="text-xl">👤</span><span className="text-[10px]">Profile</span></Link>
        </div>
      </div>
    </div>
  );
}
