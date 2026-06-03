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
  const [isLockedPage, setIsLockedPage] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [questionsHash, setQuestionsHash] = useState('');

  // Update date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
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
      
      // Get current questions from server
      const res = await fetch('/api/questions');
      const serverQuestions = await res.json();
      
      // Create hash of server questions
      const serverHash = serverQuestions.map(q => q._id).join(',');
      setQuestionsHash(serverHash);
      
      // Get user's saved results
      const savedResults = localStorage.getItem(`quizResults_${userData?.instagramId}`);
      const savedQuestionsHash = localStorage.getItem(`quizQuestionsHash_${userData?.instagramId}`);
      
      // Check if questions have changed (admin added new questions)
      if (savedResults && savedQuestionsHash === serverHash) {
        // Same questions - show PREVIEW PAGE
        const parsed = JSON.parse(savedResults);
        setUserAnswers(parsed.userAnswers || []);
        setScore(parsed.score || 0);
        setQuestions(parsed.questions || []);
        setShowResults(true);
        setQuizLocked(true);
        setIsLockedPage(true);
        setQuizCompleted(true);
        setLoading(false);
        return;
      }
      
      // New questions available or no saved results - show new quiz
      if (serverQuestions && serverQuestions.length > 0) {
        setQuestions(serverQuestions);
        setAnswers(new Array(serverQuestions.length).fill(null));
        setUserAnswers(new Array(serverQuestions.length).fill(null));
        setQuizLocked(false);
        setIsLockedPage(false);
        setShowResults(false);
        setQuizCompleted(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && !showResults && !showReview && timeLeft > 0 && !quizLocked && !isLockedPage && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && !quizLocked && !isLockedPage) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, showResults, showReview, showExplanation, quizLocked, isLockedPage, quizCompleted]);

  const handleAnswerSelect = (answer) => {
    if (quizLocked || isLockedPage || quizCompleted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (quizLocked || isLockedPage || quizCompleted) return;
    if (!selectedAnswer && !showExplanation) return;

    if (!showExplanation && selectedAnswer) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.answer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
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
    if (currentQuestion > 0 && !quizLocked && !isLockedPage && !quizCompleted) {
      setShowExplanation(false);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setTimeLeft(120);
    }
  };

  const calculateScore = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer && questions[idx] && answer === questions[idx].answer) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    setShowResults(true);
    setQuizCompleted(true);
    setTimerActive(false);
    setQuizLocked(true);
    
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
      
      // Save results with questions hash
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
          userAnswers: userAnswers,
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
      
      await fetch('/api/leaderboard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const updatedUser = { 
        ...user, 
        score: newTotalScore, 
        totalQuizzesTaken: newQuizzesTaken,
        lastQuizDate: new Date()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const getFilteredQuestions = () => {
    if (reviewFilter === 'wrong') {
      return userAnswers.filter((ans) => ans && !ans.isCorrect);
    } else if (reviewFilter === 'correct') {
      return userAnswers.filter((ans) => ans && ans.isCorrect);
    }
    return userAnswers.filter((ans) => ans !== null);
  };

  // Format time function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const formattedTimeSpent = formatTime(timeSpent);

  // Format date
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // ========== PREVIEW PAGE (Shown after quiz completion OR when returning to quiz) ==========
  if ((quizCompleted && showResults && !showReview && !loading) || (isLockedPage && !showReview && !loading)) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    const wrongCount = (questions.length || 0) - score;
    const isPassed = percentage >= 40;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Date and Time Box */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-semibold text-gray-700">{formattedTime}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-semibold text-gray-700">{formattedTimeSpent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header - Congratulations */}
          <div className="text-center mb-6">
            <div className="text-7xl mb-3 animate-bounce">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800">Congratulations!</h1>
            <p className="text-gray-500 text-sm mt-1">You have completed this quiz</p>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-5 text-white shadow-lg">
            <div className="text-center">
              <p className="text-blue-100 text-sm mb-1">Your Score</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-6xl font-bold">{score}</span>
                <span className="text-2xl opacity-80">/{questions.length}</span>
              </div>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isPassed ? 'bg-green-400' : 'bg-red-400'}`}>
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-1">✅</div>
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-1">❌</div>
              <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
          </div>

          {/* Quiz Locked Message */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔒</div>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Quiz Completed!</p>
                <p className="text-xs text-yellow-600">You have already taken this quiz</p>
                <p className="text-xs text-orange-600 mt-1">⚠️ New quiz will be available when admin adds new questions</p>
              </div>
            </div>
          </div>

          {/* Preview Questions Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📋</span> Your Answers Preview
            </h2>
            <p className="text-xs text-gray-500 mb-3">Click on any question to review detailed explanation</p>
          </div>

          {/* Questions Preview List - Clickable */}
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {userAnswers.filter(a => a !== null).map((item, idx) => {
              const originalIndex = userAnswers.findIndex(a => a === item);
              return (
                <div 
                  key={originalIndex} 
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 cursor-pointer hover:shadow-md transition-all ${
                    item.isCorrect ? 'border-green-500' : 'border-red-500'
                  }`}
                  onClick={() => {
                    setCurrentQuestion(originalIndex);
                    setShowResults(false);
                    setQuizCompleted(false);
                    setIsLockedPage(false);
                    setShowReview(true);
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">Question {originalIndex + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Correct</span> : 
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ Wrong</span>
                      }
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                      {item.question}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">Your answer:</span>
                      <span className={`text-xs font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {item.selected}
                      </span>
                      {!item.isCorrect && (
                        <>
                          <span className="text-xs text-gray-400">| Correct:</span>
                          <span className="text-xs text-green-600 font-medium">{item.correctAnswer}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-blue-500 flex items-center gap-1">
                      <span>🔍</span> Click to view full explanation
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wait for New Quiz Message */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">⏳</span>
              <span className="text-sm font-semibold text-blue-800">Waiting for New Quiz</span>
            </div>
            <p className="text-xs text-blue-600">
              New quiz will be available when admin adds new questions. Check back later!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-3">
            <button 
              onClick={() => setShowReview(true)} 
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              📖 Detailed Review
            </button>
            <Link 
              href="/" 
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center"
            >
              🏠 Go Home
            </Link>
          </div>

          {/* Study Notes Link */}
          <Link 
            href="/notes" 
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition"
          >
            📚 Study Notes
          </Link>
        </div>

        <AdSpace type="banner" className="mx-4 mt-4" />
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-50">
          <div className="flex justify-around max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">🏠</span><span className="text-xs">Home</span>
            </Link>
            <Link href="/quiz" className="flex flex-col items-center text-green-600">
              <span className="text-xl">🎯</span><span className="text-xs">Quiz</span>
            </Link>
            <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">📝</span><span className="text-xs">Notes</span>
            </Link>
            <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">📰</span><span className="text-xs">Current</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">👤</span><span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========== DETAILED REVIEW PAGE ==========
  if (showReview) {
    const filteredQuestions = getFilteredQuestions();
    const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
    const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
          <div className="text-center">
            <div className="text-5xl mb-2">📋</div>
            <h1 className="text-2xl font-bold">Your Answers</h1>
            <p className="text-blue-100 text-sm mt-1">Detailed review with explanations</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
            <button 
              onClick={() => setReviewFilter('all')} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All ({userAnswers.filter(a => a !== null).length})
            </button>
            <button 
              onClick={() => setReviewFilter('wrong')} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              ❌ Wrong ({wrongCount})
            </button>
            <button 
              onClick={() => setReviewFilter('correct')} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              ✅ Correct ({correctCount})
            </button>
          </div>
          
          {/* Questions List */}
          <div className="space-y-4 mb-24">
            {filteredQuestions.map((item, idx) => {
              const originalIndex = userAnswers.findIndex(a => a === item);
              return (
                <div key={originalIndex} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-600">Question {originalIndex + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Correct</span> : 
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ Wrong</span>
                      }
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">{item.question}</h3>
                    <div className="space-y-2 mb-3">
                      {item.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isUserAnswer = item.selected === opt;
                        const isCorrectAnswer = item.correctAnswer === opt;
                        let bgClass = 'bg-gray-50';
                        if (isCorrectAnswer) bgClass = 'bg-green-100';
                        if (isUserAnswer && !isCorrectAnswer) bgClass = 'bg-red-100';
                        return (
                          <div key={optIdx} className={`p-2 rounded-lg ${bgClass} text-sm`}>
                            <span className="font-medium">{letter}.</span> {opt}
                            {isCorrectAnswer && <span className="text-green-600 text-xs ml-2">✓ Correct</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 text-xs ml-2">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs font-semibold text-blue-800">📖 Explanation:</p>
                      <p className="text-xs text-blue-700 mt-1">{item.explanation || `Correct answer is ${item.correctAnswer}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold">← Back to Preview</button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold text-center">📚 Study More</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold">No Questions Available</h2>
          <p className="text-gray-500 text-sm mt-2">Please add questions from admin panel.</p>
          <Link href="/" className="text-green-600 mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Date and Time Box - Divided */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-semibold text-gray-700">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="font-bold text-green-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">{currentQ?.question}</h2>
          </div>
          <div className="p-4 space-y-3">
            {currentQ?.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQ?.answer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;
              let bgColor = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
              let textColor = 'text-gray-700';
              if (showCorrect) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
              else if (showWrong) { bgColor = 'bg-red-50 border-red-400'; textColor = 'text-red-700'; }
              else if (isSelected && !showExplanation) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
              return (
                <button key={idx} onClick={() => !showExplanation && handleAnswerSelect(opt)} disabled={showExplanation || quizLocked} className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${bgColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${showCorrect ? 'bg-green-600 text-white' : showWrong ? 'bg-red-600 text-white' : isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{letter}</div>
                    <span className={`flex-1 text-sm ${textColor} font-medium`}>{opt}</span>
                    {showCorrect && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Correct</span>}
                    {showWrong && <span className="text-red-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Wrong</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 animate-fadeIn">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800 mb-1">Explanation:</p>
                <p className="text-sm text-blue-700 leading-relaxed">{currentQ?.explanation || `The correct answer is ${currentQ?.answer}.`}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button onClick={handlePreviousQuestion} className="flex-1 bg-white text-gray-700 py-3 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50">
              ← Previous
            </button>
          )}
          <button 
            onClick={handleSubmitAnswer} 
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : selectedAnswer ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
            disabled={(!showExplanation && !selectedAnswer) || quizLocked}
          >
            {showExplanation ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →') : '✓ Submit Answer'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">🔒 One attempt per question set • New quiz when admin adds questions</p>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-green-600">
            <span className="text-xl">🎯</span><span className="text-xs">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📝</span><span className="text-xs">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .select-none { user-select: none; -webkit-user-select: none; }
      `}</style>
    </div>
  );
}