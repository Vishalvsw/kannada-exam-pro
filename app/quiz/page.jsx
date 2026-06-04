'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [startTime, setStartTime] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [answers, setAnswers] = useState([]);
  const [filter, setFilter] = useState('all');

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check login
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setStartTime(Date.now());
    loadQuiz();
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (!showResult && !showReview && timeLeft > 0 && !quizLocked && !quizDone) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, showReview, quizLocked, quizDone]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Check if already taken
      const saved = localStorage.getItem(`quizResults_${user?.instagramId}`);
      if (saved && user) {
        const parsed = JSON.parse(saved);
        setUserAnswers(parsed.userAnswers || []);
        setScore(parsed.score || 0);
        setQuestions(parsed.questions || []);
        setShowResult(true);
        setQuizLocked(true);
        setQuizDone(true);
        setLoading(false);
        return;
      }
      
      // Load new questions
      const res = await fetch('/api/questions');
      const data = await res.json();
      setQuestions(data);
      setAnswers(new Array(data.length).fill(null));
      setUserAnswers(new Array(data.length).fill(null));
      setQuizLocked(false);
      setShowResult(false);
      setQuizDone(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answer) => {
    if (quizLocked || quizDone || showExplanation) return;
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (quizLocked || quizDone) return;
    if (!selectedAnswer && !showExplanation) return;

    if (!showExplanation && selectedAnswer) {
      // First time submitting - check answer and show explanation
      const isCorrect = selectedAnswer === questions[currentIndex]?.answer;
      if (isCorrect) setScore(prev => prev + 1);
      
      const newAnswers = [...answers];
      newAnswers[currentIndex] = selectedAnswer;
      setAnswers(newAnswers);
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentIndex] = {
        selected: selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: questions[currentIndex]?.answer,
        question: questions[currentIndex]?.question,
        options: questions[currentIndex]?.options,
        explanation: questions[currentIndex]?.explanation
      };
      setUserAnswers(newUserAnswers);
      
      setShowExplanation(true);
    } else {
      // Moving to next question
      setShowExplanation(false);
      setSelectedAnswer('');
      
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setTimeLeft(120);
      } else {
        finishQuiz();
      }
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0 && !quizLocked && !quizDone) {
      setShowExplanation(false);
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1] || '');
      setTimeLeft(120);
    }
  };

  const finishQuiz = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer && questions[idx] && answer === questions[idx].answer) finalScore++;
    });
    
    setScore(finalScore);
    setShowResult(true);
    setQuizDone(true);
    setQuizLocked(true);
    
    if (user) {
      localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
        userAnswers: userAnswers,
        score: finalScore,
        questions: questions,
        completedAt: Date.now()
      }));
    }
    
    saveResult(finalScore);
  };

  const saveResult = async (finalScore) => {
    if (!user) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

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
          timeFormatted: `${mins}m ${secs}s`,
          correctCount: finalScore,
          wrongCount: questions.length - finalScore,
          completedAt: new Date()
        })
      });
      
      const newTotal = (user.score || 0) + finalScore;
      const newQuizzes = (user.totalQuizzesTaken || 0) + 1;
      
      await fetch('/api/users/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: user.instagramId,
          name: user.name,
          email: user.email,
          newScore: finalScore,
          totalScore: newTotal,
          quizzesTaken: newQuizzes
        })
      });
      
      await fetch('/api/leaderboard/sync', { method: 'POST' });
      
      const updated = { ...user, score: newTotal, totalQuizzesTaken: newQuizzes };
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedClock = currentDateTime.toLocaleTimeString();
  const duration = startTime ? formatTime(Math.floor((Date.now() - startTime) / 1000)) : '00:00';

  // ========== RESULT PAGE ==========
  if ((quizDone && showResult && !showReview && !loading) || (quizLocked && !showReview && !loading)) {
    const percent = Math.round((score / (questions.length || 1)) * 100);
    const wrong = (questions.length || 0) - score;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <AdSpace type="banner" className="mx-4 mt-2" />
        <div className="max-w-md mx-auto px-4 py-4">
          
          {/* Date & Duration */}
          <div className="bg-white rounded-xl shadow p-3 mb-4 flex justify-around">
            <div className="text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-[10px] text-gray-400">DATE</p>
              <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-[10px] text-gray-400">DURATION</p>
              <p className="text-sm font-semibold text-gray-700">{duration}</p>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 mb-4 text-white text-center">
            <div className="text-5xl mb-1">🏆</div>
            <p className="text-sm text-blue-100">Your Score</p>
            <div className="text-5xl font-bold">{score}</div>
            <p className="text-lg">out of {questions.length}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm">{percent}%</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow">
              <div className="text-3xl mb-1">✅</div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow">
              <div className="text-3xl mb-1">❌</div>
              <div className="text-2xl font-bold text-red-600">{wrong}</div>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
          </div>

          {/* Locked Message */}
          <div className="bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔒</div>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Quiz Completed!</p>
                <p className="text-xs text-yellow-600">New quiz will be available when admin adds new questions</p>
              </div>
            </div>
          </div>

          {/* Answer Preview - Clickable */}
          <div className="mb-4">
            <h2 className="font-bold text-gray-700 mb-2">📋 Your Answers</h2>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {userAnswers.filter(a => a !== null).map((item, idx) => {
                const originalIdx = userAnswers.findIndex(a => a === item);
                return (
                  <div 
                    key={originalIdx} 
                    className={`bg-white rounded-lg p-2 shadow cursor-pointer hover:shadow-md transition border-l-4 ${item.isCorrect ? 'border-green-500' : 'border-red-500'}`}
                    onClick={() => { setCurrentIndex(originalIdx); setShowResult(false); setQuizDone(false); setQuizLocked(false); setShowReview(true); }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-500">Q{originalIdx + 1}</span>
                      <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {item.isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-700 line-clamp-2">{item.question?.substring(0, 50)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Ans: {item.selected}</p>
                    <p className="text-[9px] text-blue-500 text-center mt-1">Click to review →</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
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
        <AdSpace type="banner" className="mx-4 mt-4" />
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
          <div className="flex justify-around max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">⌂</span>
              <span className="text-[10px]">Home</span>
            </Link>
            <Link href="/quiz" className="flex flex-col items-center text-green-600">
              <span className="text-xl">◉</span>
              <span className="text-[10px]">Quiz</span>
            </Link>
            <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">◻</span>
              <span className="text-[10px]">Notes</span>
            </Link>
            <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">◈</span>
              <span className="text-[10px]">News</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">⌗</span>
              <span className="text-[10px]">Rank</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
              <span className="text-xl">⍟</span>
              <span className="text-[10px]">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========== REVIEW PAGE ==========
  if (showReview) {
    const filtered = filter === 'all' ? userAnswers.filter(a => a !== null) : userAnswers.filter(a => a && (filter === 'correct' ? a.isCorrect : !a.isCorrect));
    const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
    const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <AdSpace type="banner" className="mx-4 mt-2" />
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-6 text-center">
          <div className="text-5xl mb-1">📋</div>
          <h1 className="text-xl font-bold">Answer Review</h1>
          <p className="text-xs text-blue-100 mt-1">Detailed explanations for all questions</p>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 bg-white rounded-xl p-1 shadow-sm">
            <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              All ({userAnswers.filter(a => a !== null).length})
            </button>
            <button onClick={() => setFilter('wrong')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${filter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              ❌ Wrong ({wrongCount})
            </button>
            <button onClick={() => setFilter('correct')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${filter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              ✅ Correct ({correctCount})
            </button>
          </div>
          
          {/* Questions List */}
          <div className="space-y-3 pb-24">
            {filtered.map((item, idx) => {
              const original = userAnswers.findIndex(a => a === item);
              return (
                <div key={original} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-blue-600">Question {original + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Correct</span> : 
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✗ Wrong</span>
                      }
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">{item.question}</h3>
                    <div className="space-y-1 mb-2">
                      {item.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isUser = item.selected === opt;
                        const isCorrect = item.correctAnswer === opt;
                        let bg = 'bg-gray-50';
                        if (isCorrect) bg = 'bg-green-100';
                        if (isUser && !isCorrect) bg = 'bg-red-100';
                        return (
                          <div key={optIdx} className={`p-2 rounded-lg ${bg} text-xs`}>
                            <span className="font-medium">{letter}.</span> {opt}
                            {isCorrect && <span className="text-green-600 text-[10px] ml-1">✓</span>}
                            {isUser && !isCorrect && <span className="text-red-600 text-[10px] ml-1">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-[10px] font-semibold text-blue-800">📖 Explanation:</p>
                      <p className="text-[11px] text-blue-700 mt-0.5">{item.explanation || `The correct answer is ${item.correctAnswer}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">← Back to Results</button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold text-center">📚 Study More</Link>
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
          <div className="text-6xl mb-3">📝</div>
          <h2 className="text-xl font-bold text-gray-800">No Questions Available</h2>
          <p className="text-gray-500 text-sm mt-2">Please add questions from admin panel.</p>
          <Link href="/" className="text-green-600 mt-4 inline-block">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const hasAnswered = answers[currentIndex] !== null;

  // ========== ACTIVE QUIZ PAGE ==========
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="max-w-md mx-auto px-4 py-4">
        
        {/* Date & Time Box */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-4 flex justify-around border border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-1">📅</div>
            <p className="text-[10px] text-gray-400">DATE</p>
            <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl mb-1">⏰</div>
            <p className="text-[10px] text-gray-400">TIME</p>
            <p className="text-sm font-semibold text-gray-700">{formattedClock}</p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Time Remaining</p>
          <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Question {currentIndex + 1} of {total}</span>
            <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-[10px] text-gray-400 mt-1">of {total}</p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {currentIndex + 1}
              </div>
              <h2 className="font-semibold text-gray-800 text-sm flex-1 leading-relaxed">{currentQ?.question}</h2>
              {hasAnswered && (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-[10px] font-bold">✓</span>
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
              const disabled = showExplanation || quizLocked || hasAnswered;
              
              let bgClass = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
              if (showCorrect) bgClass = 'bg-green-50 border-green-400';
              if (showWrong) bgClass = 'bg-red-50 border-red-400';
              if (isSelected && !showExplanation && !hasAnswered) bgClass = 'bg-green-50 border-green-400';
              
              return (
                <button 
                  key={idx} 
                  onClick={() => !disabled && selectAnswer(opt)} 
                  disabled={disabled} 
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${bgClass} ${disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      showCorrect || (isSelected && !disabled) ? 'bg-green-600 text-white' : 
                      showWrong ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {letter}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{opt}</span>
                    {showCorrect && <span className="text-green-600 text-xs font-medium">✓</span>}
                    {showWrong && <span className="text-red-600 text-xs font-medium">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Box */}
        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
            <div className="flex gap-2">
              <div className="text-blue-500 text-base">💡</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800">Explanation</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  {currentQ?.explanation || `The correct answer is ${currentQ?.answer}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-2">
          {currentIndex > 0 && (
            <button 
              onClick={goPrevious} 
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition"
            >
              ← Previous
            </button>
          )}
          <button 
            onClick={submitAnswer} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              selectedAnswer ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`} 
            disabled={(!showExplanation && !selectedAnswer) || quizLocked}
          >
            {showExplanation ? (currentIndex + 1 === total ? '🏆 Finish' : 'Next →') : '✓ Submit'}
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-center text-[9px] text-gray-400 mt-4">
          🔒 One attempt per question set • New quiz when admin adds questions
        </p>
      </div>

      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">⌂</span>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-green-600">
            <span className="text-xl">◉</span>
            <span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">◻</span>
            <span className="text-[10px]">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">◈</span>
            <span className="text-[10px]">News</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">⌗</span>
            <span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">⍟</span>
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}