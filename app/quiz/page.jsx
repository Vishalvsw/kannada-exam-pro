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
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [quizLocked, setQuizLocked] = useState(false);
  const [currentQuizVersion, setCurrentQuizVersion] = useState('');
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // First, get user from localStorage
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
    fetchQuestionsAndCheck();
  }, [router]);

  const fetchQuestionsAndCheck = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/questions');
      const data = await res.json();
      
      if (data && data.length > 0) {
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
        setUserAnswers(new Array(data.length).fill(null));
        
        // Create version hash from questions
        const versionString = data.map(q => `${q._id}-${q.answer}`).join(',');
        const versionHash = btoa(unescape(encodeURIComponent(versionString))).substring(0, 50);
        setCurrentQuizVersion(versionHash);
        
        console.log('📌 Current Quiz Version:', versionHash);
        
        // Check if user has already taken this version
        const takenQuizVersion = localStorage.getItem(`quizVersion_${user?.instagramId}`);
        console.log('📌 Saved Version:', takenQuizVersion);
        
        if (takenQuizVersion && takenQuizVersion === versionHash) {
          // Quiz is LOCKED - Show saved results
          console.log('🔒 QUIZ IS LOCKED!');
          const savedResults = localStorage.getItem(`quizResults_${user?.instagramId}`);
          if (savedResults) {
            const parsed = JSON.parse(savedResults);
            setUserAnswers(parsed.userAnswers);
            setScore(parsed.score);
            setShowResults(true);
            setCanTakeQuiz(false);
            setQuizLocked(true);
            setTestMessage('Quiz Locked - Showing saved results');
          }
        } else {
          // New quiz available
          console.log('✅ New quiz available!');
          setCanTakeQuiz(true);
          setQuizLocked(false);
          setShowResults(false);
          setTestMessage('New quiz available - Take the quiz');
        }
      }
      setInitialCheckDone(true);
    } catch (error) {
      console.error('Error:', error);
      setTestMessage('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && !showResults && !showReview && timeLeft > 0 && canTakeQuiz && !quizLocked) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && canTakeQuiz && !quizLocked) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, showResults, showReview, showExplanation, canTakeQuiz, quizLocked]);

  const handleAnswerSelect = (answer) => {
    if (!canTakeQuiz || quizLocked) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!canTakeQuiz || quizLocked) return;
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
    if (currentQuestion > 0 && !quizLocked) {
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
    
    console.log('🏆 Final Score:', finalScore);
    setScore(finalScore);
    setShowResults(true);
    setTimerActive(false);
    setCanTakeQuiz(false);
    setQuizLocked(true);
    
    // SAVE QUIZ RESULTS TO LOCALSTORAGE
    if (user && currentQuizVersion) {
      // Build final user answers
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
      
      // SAVE TO LOCALSTORAGE - THIS IS CRITICAL!
      localStorage.setItem(`quizVersion_${user.instagramId}`, currentQuizVersion);
      localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
        userAnswers: finalUserAnswers,
        score: finalScore,
        completedAt: Date.now()
      }));
      
      console.log('💾 Quiz LOCKED! Version saved:', currentQuizVersion);
      console.log('💾 Score saved:', finalScore);
      setTestMessage(`Quiz locked! Score: ${finalScore}/${questions.length}`);
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
          userAnswers: userAnswers
        })
      });
      const updatedUser = { ...user, score: (user.score || 0) + finalScore, totalQuizzesTaken: (user.totalQuizzesTaken || 0) + 1 };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 Quiz result saved to database');
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

  // LOCKED QUIZ RESULTS PAGE
  if ((!canTakeQuiz || quizLocked) && showResults && !showReview && !loading) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    const wrongCount = (questions.length || 0) - score;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        <AdSpace type="inArticle" className="mx-4 my-2" />
        
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800">Quiz Locked!</h2>
            <p className="text-gray-500 text-sm mt-1">You have already completed this quiz</p>
            <p className="text-xs text-orange-600 mt-1">New quiz will be available when admin adds new questions</p>
            {testMessage && <p className="text-xs text-green-600 mt-2">{testMessage}</p>}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">@{user?.instagramId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Quiz Completed</p>
                <p className="text-xs text-green-600 font-semibold">✓ Locked</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-5 text-white shadow-lg">
            <p className="text-center text-green-100 mb-2">Your Score</p>
            <div className="text-center">
              <span className="text-6xl font-bold">{score}</span>
              <span className="text-2xl opacity-80">/{questions.length}</span>
            </div>
            <div className="mt-3 text-center">
              <p className="text-2xl font-semibold">{percentage}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">❌</div>
              <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              🔒 This quiz is locked! Wait for admin to add new questions.
            </p>
          </div>
          
          <div className="flex gap-3 mb-3">
            <button onClick={() => setShowReview(true)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              📖 Review Your Answers
            </button>
            <Link href="/" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center">
              Go Home
            </Link>
          </div>
          <Link href="/notes" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">
            📚 Study Notes
          </Link>
        </div>
        
        <AdSpace type="inArticle" className="mx-4 my-4" />
        <AdSpace type="banner" className="mx-4 mt-4" />
      </div>
    );
  }

  // REVIEW PAGE
  if (showReview) {
    const filteredQuestions = getFilteredQuestions();
    const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
    const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        <AdSpace type="inArticle" className="mx-4 my-2" />
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
          <div className="text-center">
            <div className="text-5xl mb-2">📋</div>
            <h1 className="text-2xl font-bold">Quiz Review</h1>
            <p className="text-blue-100 text-sm mt-1">Review your answers - Read only mode</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
            <button
              onClick={() => setReviewFilter('all')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${reviewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              All ({userAnswers.filter(a => a !== null).length})
            </button>
            <button
              onClick={() => setReviewFilter('wrong')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              ❌ Wrong ({wrongCount})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              ✅ Correct ({correctCount})
            </button>
          </div>
          
          <div className="space-y-4 mb-24 select-none">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, idx) => {
                const originalIndex = userAnswers.findIndex(a => a === item);
                return (
                  <div 
                    key={originalIndex} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-blue-600">Question {originalIndex + 1}</span>
                        {item.isCorrect ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Correct</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ Wrong</span>
                        )}
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
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No questions to review</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold">
              ← Back to Results
            </button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold text-center">
              📚 Study More
            </Link>
          </div>
        </div>
        
        <AdSpace type="inArticle" className="mx-4 my-4" />
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // NO QUESTIONS
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
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="mx-4 mt-2">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 text-center border border-green-100">
          <p className="text-xs text-green-600 font-medium">📖 Kannada Exam Pro</p>
          <p className="text-xs text-green-500">Master Karnataka Exams</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        
        {/* Debug Message - Remove in production */}
        {testMessage && (
          <div className="mb-4 p-2 bg-blue-50 text-blue-600 text-xs text-center rounded-lg">
            {testMessage}
          </div>
        )}
        
        {/* Timer Row */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <AdSpace type="inArticle" className="mx-0 my-2" />

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="font-bold text-green-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <AdSpace type="inArticle" className="mx-0 my-2" />

        {/* Question Box */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQ?.question}
            </h2>
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
              
              if (showCorrect) {
                bgColor = 'bg-green-50 border-green-400';
                textColor = 'text-green-700';
              } else if (showWrong) {
                bgColor = 'bg-red-50 border-red-400';
                textColor = 'text-red-700';
              } else if (isSelected && !showExplanation) {
                bgColor = 'bg-green-50 border-green-400';
                textColor = 'text-green-700';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !showExplanation && handleAnswerSelect(opt)}
                  disabled={showExplanation || !canTakeQuiz || quizLocked}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      showCorrect ? 'bg-green-600 text-white' :
                      showWrong ? 'bg-red-600 text-white' :
                      isSelected ? 'bg-green-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {letter}
                    </div>
                    <span className={`flex-1 text-sm ${textColor} font-medium`}>
                      {opt}
                    </span>
                    {showCorrect && (
                      <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Correct
                      </span>
                    )}
                    {showWrong && (
                      <span className="text-red-600 text-xs font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Wrong
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 animate-fadeIn">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800 mb-1">Explanation:</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {currentQ?.explanation || `The correct answer is ${currentQ?.answer}.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <AdSpace type="inArticle" className="mx-0 my-2" />

        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={handlePreviousQuestion}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleSubmitAnswer}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showExplanation
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg'
                : selectedAnswer
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={(!showExplanation && !selectedAnswer) || !canTakeQuiz || quizLocked}
          >
            {showExplanation 
              ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →')
              : '✓ Submit Answer'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">🔒 One attempt per question set • New quiz when admin adds questions</p>
        </div>
      </div>

      <AdSpace type="inArticle" className="mx-4 my-2" />
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .select-none {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
}