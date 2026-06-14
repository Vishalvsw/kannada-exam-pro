'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [stats, setStats] = useState({
    totalScore: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0,
    bestScore: 0,
    averagePercentage: 0,
    rank: 0
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [newInstagramId, setNewInstagramId] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);
    setNewInstagramId(currentUser.instagramId || '');
    
    // Load data in parallel for faster loading
    Promise.all([
      fetchUserData(currentUser),
      fetchUserRank(currentUser)
    ]).finally(() => setLoading(false));
  }, [router]);

  const fetchUserData = async (currentUser) => {
    try {
      // Fetch leaderboard and quiz results in parallel
      const [leaderboardRes, resultsRes] = await Promise.all([
        fetch('/api/leaderboard'),
        fetch('/api/quiz-results')
      ]);
      
      const leaderboard = await leaderboardRes.json();
      const allResults = await resultsRes.json();
      
      // Find user in leaderboard
      const normalize = (v) => (v || '').toString().trim().toLowerCase();
      const userLeaderboard = leaderboard.find(
        (u) => normalize(u.instagramId) === normalize(currentUser.instagramId)
      );
      
      // Filter quiz results
      const userResults = Array.isArray(allResults) ? allResults.filter((r) => {
        return normalize(r.userEmail) === normalize(currentUser.email) ||
               normalize(r.instagramId) === normalize(currentUser.instagramId);
      }) : [];
      
      setQuizResults(userResults);
      
      // Calculate stats
      let totalScore = 0;
      let totalQuestions = 0;
      let totalCorrect = 0;
      let bestScore = 0;
      let totalPercentage = 0;
      
      userResults.forEach((result) => {
        totalScore += result.score || 0;
        totalQuestions += result.totalQuestions || 0;
        totalCorrect += result.correctCount || result.score || 0;
        bestScore = Math.max(bestScore, result.score || 0);
        totalPercentage += result.percentage || 0;
      });
      
      const totalWrong = totalQuestions - totalCorrect;
      const accuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
      const avgPercentage = userResults.length > 0 ? (totalPercentage / userResults.length).toFixed(1) : 0;
      
      setStats({
        totalScore: userLeaderboard?.score || totalScore,
        totalQuizzes: userResults.length,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        accuracy,
        bestScore,
        averagePercentage: avgPercentage,
        rank: 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserRank = async (currentUser) => {
    try {
      const response = await fetch('/api/leaderboard');
      const leaderboard = await response.json();
      const normalize = (value) => (value || '').toString().trim().toLowerCase();
      
      const rank = leaderboard.findIndex(
        (u) => normalize(u.instagramId) === normalize(currentUser.instagramId)
      ) + 1;
      setStats(prev => ({ ...prev, rank: rank || 0 }));
    } catch (error) {
      console.error('Error fetching rank:', error);
    }
  };

  const handleUpdateInstagram = async () => {
    if (!newInstagramId || newInstagramId === user.instagramId) {
      setShowEditModal(false);
      return;
    }
    
    try {
      const response = await fetch('/api/users/update-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          oldInstagramId: user.instagramId,
          newInstagramId: newInstagramId.replace('@', '')
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedUser = { ...user, instagramId: newInstagramId.replace('@', '') };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ text: '✅ Instagram ID updated!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
        
        // Refresh data without full page reload
        fetchUserData(updatedUser);
        fetchUserRank(updatedUser);
      } else {
        setMessage({ text: '❌ Update failed', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ text: '❌ Error updating', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
    setShowEditModal(false);
  };

  // Show loading only on first load
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Toast Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg animate-slide-in ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Header - No loading, shows immediately */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={user.profileImage || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff&size=120`} 
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover" 
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff&size=120`;
                }}
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <span className="bg-white/20 backdrop-blur-lg rounded-full px-3 py-1 text-sm">
                  {user.role === 'admin' ? '👑 Admin' : '📚 Student'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="text-2xl">📸</span>
                <span className="text-lg">@{user.instagramId}</span>
                <button onClick={() => setShowEditModal(true)} className="text-sm bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition">
                  ✏️ Edit
                </button>
              </div>
              <p className="text-green-100 text-sm mt-1">{user.email}</p>
              <div className="flex gap-3 mt-3 justify-center md:justify-start">
                <div className="bg-white/20 rounded-lg px-3 py-1 text-center">
                  <p className="text-xs">Member since</p>
                  <p className="text-sm font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1 text-center">
                  <p className="text-xs">Global Rank</p>
                  <p className="text-sm font-semibold">#{stats.rank || '—'}</p>
                </div>
              </div>
            </div>
            <div className="md:ml-auto">
              <Link href="/quiz">
                <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105">
                  🎯 Take Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Shows immediately with data as it loads */}
      <div className="max-w-4xl mx-auto px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-gray-500 text-xs">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalScore}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-gray-500 text-xs">Quizzes Taken</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalQuizzes}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <p className="text-gray-500 text-xs">Correct Answers</p>
              <p className="text-xl font-bold text-purple-600">{stats.correctAnswers}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <p className="text-gray-500 text-xs">Accuracy</p>
              <p className="text-xl font-bold text-orange-600">{stats.accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-4xl mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Your Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-semibold text-blue-600">{stats.totalScore} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(stats.totalScore / 10, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quiz Completion</span>
                <span className="font-semibold text-green-600">{stats.totalQuizzes} quizzes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${Math.min(stats.totalQuizzes * 5, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="font-semibold text-orange-600">{stats.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: `${stats.accuracy}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performance */}
      <div className="max-w-4xl mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Best Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-xl">
              <p className="text-gray-500 text-xs">Best Score</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.bestScore}</p>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-xl">
              <p className="text-gray-500 text-xs">Average Score</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.averagePercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History - Lazy loaded */}
      <div className="max-w-4xl mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span> Quiz History
          </h3>
          {quizResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-500">No quiz attempts yet</p>
              <Link href="/quiz" className="inline-block mt-3 text-green-600 text-sm font-semibold hover:underline">
                Take your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quizResults.slice(0, 10).map((quiz, idx) => (
                <div key={quiz._id || idx} className="border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">Quiz #{quizResults.length - idx}</p>
                      <p className="text-xs text-gray-500">{new Date(quiz.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{quiz.score}/{quiz.totalQuestions}</p>
                      <p className="text-xs text-gray-500">{quiz.percentage}%</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-green-600">✓ {quiz.correctCount || quiz.score} correct</span>
                    <span className="text-red-600">✗ {quiz.wrongCount || quiz.totalQuestions - quiz.score} wrong</span>
                  </div>
                </div>
              ))}
              {quizResults.length > 10 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-green-600 hover:underline">View all {quizResults.length} quizzes</summary>
                  <div className="mt-2 space-y-3">
                    {quizResults.slice(10).map((quiz, idx) => (
                      <div key={quiz._id || idx} className="border-b pb-3 hover:bg-gray-50 p-2 rounded-lg transition">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">Quiz #{quizResults.length - (idx + 11)}</p>
                            <p className="text-xs text-gray-500">{new Date(quiz.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">{quiz.score}/{quiz.totalQuestions}</p>
                            <p className="text-xs text-gray-500">{quiz.percentage}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-5 mt-6 flex gap-3">
        <Link href="/quiz" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold text-center hover:shadow-lg transition">
          🎯 Take New Quiz
        </Link>
        <Link href="/leaderboard" className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">
          🏆 View Leaderboard
        </Link>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

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
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-green-600">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>

      {/* Edit Instagram Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Instagram ID</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram ID</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">@</span>
                <input
                  type="text"
                  value={newInstagramId}
                  onChange={(e) => setNewInstagramId(e.target.value.replace('@', ''))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This will be visible on leaderboard</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdateInstagram} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Save Changes</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
