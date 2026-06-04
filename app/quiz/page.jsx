'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [quizLocked, setQuizLocked] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [questionsHash, setQuestionsHash] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (!userData.instagramId) {
      router.push('/setup-instagram');
      return;
    }
    setUser(userData);
    setStartTime(Date.now());
    checkQuizLockStatus(userData);
  }, [router]);

  const checkQuizLockStatus = async (userData) => {
    try {
      setLoading(true);
      
      const res = await fetch('/api/questions');
      const serverQuestions = await res.json();
      const serverHash = serverQuestions.map(q => q._id).join(',');
      setQuestionsHash(serverHash);
      
      const savedResults = localStorage.getItem(`quizResults_${userData?.instagramId}`);
      const savedHash = localStorage.getItem(`quizQuestionsHash_${userData?.instagramId}`);
      
      if (savedResults && savedHash === serverHash) {
        const parsed = JSON.parse(savedResults);
        setUserAnswers(parsed.userAnswers || []);
        setScore(parsed.score || 0);
        setQuestions(parsed.questions || []);
        setShowResults(true);
        setQuizLocked(true);
        setQuizCompleted(true);
        setLoading(false);
        return;
      }
      
      if (serverQuestions && serverQuestions.length > 0) {
        setQuestions(serverQuestions);
        setAnswers(new Array(serverQuestions.length).fill(null));
        setUserAnswers(new Array(serverQuestions.length).fill(null));
        setQuizLocked(false);
        setShowResults(false);
        setQuizCompleted(false);
        setAnsweredQuestions({});
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && !showResults && !showReview && timeLeft > 0 && !quizLocked && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && !quizLocked) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, showResults, showReview, showExplanation, quizLocked, quizCompleted]);

  const handleAnswerSelect = (answer) => {
    if (quizLocked || quizCompleted || answeredQuestions[currentQuestion]) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (quizLocked || quizCompleted) return;
    if (!selectedAnswer && !showExplanation) return;

    if (!showExplanation && selectedAnswer) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.answer;
      if (isCorrect) setScore(prev => prev + 1);
      
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestion] = {
        selected: selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: questions[currentQuestion]?.answer,
        question: questions[currentQuestion]?.question,
        options: questions[currentQuestion]?.options,
        explanation: questions[currentQuestion]?.explanation
      };
      setUserAnswers(newUserAnswers);
      
      setAnsweredQuestions(prev => ({ ...prev, [currentQuestion]: true }));
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
      setSelectedAnswer(null);
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(120);
      } else {
        calculateScore();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0 && !quizLocked && !quizCompleted) {
      setShowExplanation(false);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setTimeLeft(120);
    }
  };

  const calculateScore = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer && questions[idx] && answer === questions[idx].answer) finalScore++;
    });
    
    setScore(finalScore);
    setShowResults(true);
    setQuizCompleted(true);
    setTimerActive(false);
    setQuizLocked(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    
    if (user) {
      const finalUserAnswers = [...userAnswers];
      for (let i = 0; i < answers.length; i++) {
        if (answers[i] && !finalUserAnswers[i]) {
          finalUserAnswers[i] = {
            selected: answers[i],
            isCorrect: answers[i] === questions[i]?.answer,
            correctAnswer: questions[i]?.answer,
            question: questions[i]?.question,
            options: questions[i]?.options,
            explanation: questions[i]?.explanation
          };
        }
      }
      
      localStorage.setItem(`quizQuestionsHash_${user.instagramId}`, questionsHash);
      localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
        userAnswers: finalUserAnswers,
        score: finalScore,
        questions: questions,
        completedAt: Date.now()
      }));
    }
    
    saveQuizResult(finalScore);
  };

  const saveQuizResult = async (finalScore) => {
    if (!user) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    try {
      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: user.instagramId,
          userName: user.name,
          userEmail: user.email,
          score: finalScore,
          totalQuestions: questions.length,
          percentage: Math.round((finalScore / questions.length) * 100),
          timeFormatted: `${minutes}m ${seconds}s`,
          correctCount: finalScore,
          wrongCount: questions.length - finalScore,
          completedAt: new Date()
        })
      });
      
      const newTotalScore = (user.score || 0) + finalScore;
      const newQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
      
      await fetch('/api/users/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: user.instagramId,
          name: user.name,
          email: user.email,
          newScore: finalScore,
          totalScore: newTotalScore,
          quizzesTaken: newQuizzesTaken,
          percentage: Math.round((finalScore / questions.length) * 100)
        })
      });
      
      await fetch('/api/leaderboard/sync', { method: 'POST' });
      
      const updatedUser = { 
        ...user, 
        score: newTotalScore, 
        totalQuizzesTaken: newQuizzesTaken,
        lastQuizDate: new Date()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getFilteredQuestions = () => {
    if (reviewFilter === 'wrong') return userAnswers.filter(a => a && !a.isCorrect);
    if (reviewFilter === 'correct') return userAnswers.filter(a => a && a.isCorrect);
    return userAnswers.filter(a => a !== null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();
  const durationSpent = startTime ? formatTime(Math.floor((Date.now() - startTime) / 1000)) : '00:00';

  // ========== RESULT PAGE ==========
  if ((quizCompleted && showResults && !showReview && !loading) || (quizLocked && !showReview && !loading)) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    const wrongCount = (questions.length || 0) - score;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
        <AdSpace type="banner" className="mx-4 mt-2" />
        
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 animate-fadeOut"></div>
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-8xl animate-bounce">🎉</div>
              </div>
              <div className="absolute -top-20 left-1/4 text-4xl animate-ping">✨</div>
              <div className="absolute -top-10 right-1/4 text-3xl animate-pulse">⭐</div>
              <div className="absolute bottom-20 left-1/4 text-3xl animate-bounce">🌟</div>
              <div className="absolute bottom-10 right-1/4 text-2xl animate-ping">💫</div>
              <div className="absolute top-10 left-10 text-3xl animate-spin">🎊</div>
              <div className="absolute bottom-32 right-10 text-2xl animate-pulse">🎈</div>
            </div>
          </div>
        )}
        
        <div className="max-w-md mx-auto px-4 py-3">
          
          <div className="bg-white rounded-xl shadow-md p-3 mb-3 border border-gray-100">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                  <span className="text-blue-600 text-lg font-bold">📅</span>
                </div>
                <p className="text-[10px] text-gray-400">DATE</p>
                <p className="text-xs font-semibold text-gray-700">{formattedDate}</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                  <span className="text-green-600 text-lg font-bold">⏱️</span>
                </div>
                <p className="text-[10px] text-gray-400">DURATION</p>
                <p className="text-xs font-semibold text-gray-700">{durationSpent}</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-6xl mb-2 animate-bounce inline-block">🎉</div>
            <h1 className="text-xl font-bold text-gray-800">Quiz Completed!</h1>
            <p className="text-[11px] text-gray-500 mt-1">Great effort! Check your results below</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 mb-3 text-white shadow-lg">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">★</span>
              </div>
              <p className="text-[11px] text-blue-100 uppercase tracking-wide">Your Score</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-xl opacity-80">/{questions.length}</span>
              </div>
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-around mb-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-green-600 text-lg font-bold">✓</span>
              </div>
              <p className="text-[10px] text-gray-400">Correct</p>
              <p className="text-base font-bold text-green-600">{score}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-red-600 text-lg font-bold">✗</span>
              </div>
              <p className="text-[10px] text-gray-400">Wrong</p>
              <p className="text-base font-bold text-red-600">{wrongCount}</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-2 mb-3 border border-yellow-200">
            <div className="flex items-center gap-2"> 
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">🔒</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-yellow-800">You already completed this quiz</p>
                <p className="text-[10px] text-yellow-600">New quiz when admin adds questions</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">📋</span>
              </div>
              <h2 className="text-sm font-bold text-gray-700">Your Answers</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
              {userAnswers.filter(a => a !== null).map((item, idx) => {
                const originalIndex = userAnswers.findIndex(a => a === item);
                return (
                  <div 
                    key={originalIndex} 
                    className={`bg-white rounded-lg p-2 shadow-sm border-l-3 cursor-pointer hover:shadow-md transition-all ${item.isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}
                    onClick={() => { setCurrentQuestion(originalIndex); setShowResults(false); setQuizCompleted(false); setQuizLocked(false); setShowReview(true); }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-500">Q{originalIndex + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✓</span> : 
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">✗</span>
                      }
                    </div>
                    <p className="text-[11px] font-medium text-gray-700 line-clamp-2">{item.question?.substring(0, 45)}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[9px] text-gray-400">Ans:</span>
                      <span className={`text-[10px] font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {item.selected}
                      </span>
                    </div>
                    <div className="mt-1 text-center">
                      <span className="text-[9px] text-blue-500">View Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowReview(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Review All
            </button>
            <Link href="/" className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold text-center hover:bg-green-700 transition">
              Go Home
            </Link>
            <Link href="/notes" className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold text-center hover:bg-gray-300 transition">
              Study
            </Link>
          </div>
        </div>

        <AdSpace type="banner" className="mx-4 mt-2" />
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 px-4 shadow-lg">
          <div className="flex justify-around max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-lg">⌂</span>
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5">Home</span>
            </Link>
            <Link href="/quiz" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">◉</span>
              </div>
              <span className="text-[9px] text-green-600 font-semibold mt-0.5">Quiz</span>
            </Link>
            <Link href="/notes" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-lg">◻</span>
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5">Notes</span>
            </Link>
            <Link href="/current-affairs" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-lg">◈</span>
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5">News</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-lg">⌗</span>
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5">Rank</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-lg">⍟</span>
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5">Profile</span>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
          }
          .animate-fadeOut { animation: fadeOut 3s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  // ========== DETAILED REVIEW PAGE ==========
  if (showReview) {
    const filteredQuestions = getFilteredQuestions();
    const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
    const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <AdSpace type="banner" className="mx-4 mt-2" />
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-6 pb-5">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-xl font-bold">⌘</span>
            </div>
            <h1 className="text-xl font-bold">Answer Review</h1>
            <p className="text-blue-100 text-xs">Detailed explanations</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2 mb-4 bg-white rounded-xl p-1 shadow-sm">
            <button onClick={() => setReviewFilter('all')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All ({userAnswers.filter(a => a !== null).length})</button>
            <button onClick={() => setReviewFilter('wrong')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Wrong ({wrongCount})</button>
            <button onClick={() => setReviewFilter('correct')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Correct ({correctCount})</button>
          </div>
          
          <div className="space-y-3 mb-24">
            {filteredQuestions.map((item, idx) => {
              const originalIndex = userAnswers.findIndex(a => a === item);
              return (
                <div key={originalIndex} className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-blue-500">
                  <div className="p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[11px] font-bold text-blue-600">Q{originalIndex + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Correct</span> : 
                        <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✗ Wrong</span>
                      }
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">{item.question}</h3>
                    <div className="space-y-1 mb-2">
                      {item.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isUserAnswer = item.selected === opt;
                        const isCorrectAnswer = item.correctAnswer === opt;
                        let bgClass = 'bg-gray-50';
                        if (isCorrectAnswer) bgClass = 'bg-green-100';
                        if (isUserAnswer && !isCorrectAnswer) bgClass = 'bg-red-100';
                        return (
                          <div key={optIdx} className={`p-1.5 rounded-lg ${bgClass} text-xs`}>
                            <span className="font-medium">{letter}.</span> {opt}
                            {isCorrectAnswer && <span className="text-green-600 text-[10px] ml-1">✓</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 text-[10px] ml-1">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-[10px] font-semibold text-blue-800">Explanation:</p>
                      <p className="text-[11px] text-blue-700 mt-0.5">{item.explanation || `Correct answer is ${item.correctAnswer}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">← Back</button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold text-center">Study</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">⌘</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">No Questions Available</h2>
          <p className="text-gray-500 text-sm mt-2">Please add questions from admin panel.</p>
          <Link href="/" className="text-green-600 mt-4 inline-block">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isQuestionAnswered = answeredQuestions[currentQuestion];

  // ========== ACTIVE QUIZ PAGE ==========
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="max-w-md mx-auto px-4 py-3">
        
        <div className="bg-white rounded-xl shadow-md p-2 mb-4 border border-gray-100">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-blue-600 text-sm font-bold">📅</span>
              </div>
              <p className="text-[10px] text-gray-400">DATE</p>
              <p className="text-xs font-semibold text-gray-700">{formattedDate}</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-green-600 text-sm font-bold">⏱️</span>
              </div>
              <p className="text-[10px] text-gray-400">TIME</p>
              <p className="text-xs font-semibold text-gray-700">{formattedTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 mb-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">Time Remaining</p>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Question {currentQuestion + 1}</span>
            <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-[10px] text-gray-400 mt-1">of {totalQuestions}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{currentQuestion + 1}</span>
              </div>
              <h2 className="font-semibold text-gray-800 text-sm flex-1">{currentQ?.question}</h2>
              {isQuestionAnswered && (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-[10px]">✓</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-3 space-y-2">
            {currentQ?.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === opt;
              const showCorrect = showExplanation && opt === currentQ?.answer;
              const showWrong = showExplanation && isSelected && opt !== currentQ?.answer;
              const isDisabled = showExplanation || quizLocked || isQuestionAnswered;
              
              let bgClass = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
              if (showCorrect) bgClass = 'bg-green-50 border-green-400';
              if (showWrong) bgClass = 'bg-red-50 border-red-400';
              if (isSelected && !showExplanation && !isQuestionAnswered) bgClass = 'bg-green-50 border-green-400';
              if (isQuestionAnswered && answers[currentQuestion] === opt && !showExplanation) bgClass = 'bg-green-50 border-green-400';
              
              return (
                <button 
                  key={idx} 
                  onClick={() => !isDisabled && handleAnswerSelect(opt)} 
                  disabled={isDisabled} 
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${bgClass} ${isDisabled ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      showCorrect ? 'bg-green-600 text-white' : 
                      showWrong ? 'bg-red-600 text-white' : 
                      (isSelected && !isDisabled) ? 'bg-green-600 text-white' :
                      (isQuestionAnswered && answers[currentQuestion] === opt) ? 'bg-green-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {letter}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{opt}</span>
                    {showCorrect && <span className="text-green-600 text-xs">✓ Correct</span>}
                    {showWrong && <span className="text-red-600 text-xs">✗ Wrong</span>}
                    {isQuestionAnswered && answers[currentQuestion] === opt && !showExplanation && (
                      <span className="text-green-600 text-xs">✓ Your Answer</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">i</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-blue-800">Explanation</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  {currentQ?.explanation || `The correct answer is ${currentQ?.answer}`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {currentQuestion > 0 && (
            <button 
              onClick={handlePreviousQuestion} 
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition"
            >
              ← Previous
            </button>
          )}
          <button 
            onClick={handleSubmitAnswer} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              selectedAnswer ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`} 
            disabled={(!showExplanation && !selectedAnswer) || quizLocked || isQuestionAnswered}
          >
            {showExplanation ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →') : '✓ Submit Answer'}
          </button>
        </div>

        <p className="text-center text-[9px] text-gray-400 mt-4">
          ◈ One attempt per question set • New quiz when admin adds questions ◈
        </p>
      </div>

      <AdSpace type="banner" className="mx-4 mt-2" />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-lg">⌂</span>
            </div>
            <span className="text-[9px] text-gray-500 mt-0.5">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-lg">◉</span>
            </div>
            <span className="text-[9px] text-green-600 font-semibold mt-0.5">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-lg">◻</span>
            </div>
            <span className="text-[9px] text-gray-500 mt-0.5">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-lg">◈</span>
            </div>
            <span className="text-[9px] text-gray-500 mt-0.5">News</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-lg">⌗</span>
            </div>
            <span className="text-[9px] text-gray-500 mt-0.5">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-lg">⍟</span>
            </div>
            <span className="text-[9px] text-gray-500 mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}