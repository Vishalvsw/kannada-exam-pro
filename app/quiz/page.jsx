'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

// ===== ORDERING QUESTION COMPONENT =====
const OrderingQuestion = ({ question, onOrderChange, isAnswered }) => {
  const [items, setItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);

  const kannadaLetters = ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ'];
  const englishLetters = ['a', 'b', 'c', 'd', 'e'];

  useEffect(() => {
    if (question?.options) {
      const initialItems = question.options.map((opt, idx) => ({
        id: englishLetters[idx],
        kannadaLetter: kannadaLetters[idx],
        text: opt,
        isSelected: false,
        position: null
      }));
      
      const shuffled = [...initialItems];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setItems(shuffled);
      setSelectedOrder([]);
    }
  }, [question]);

  const handleSelect = (itemId) => {
    if (isAnswered) return;
    if (selectedOrder.includes(itemId)) return;
    if (selectedOrder.length === 5) return;

    const newOrder = [...selectedOrder, itemId];
    setSelectedOrder(newOrder);
    
    const updatedItems = items.map(item => ({
      ...item,
      isSelected: newOrder.includes(item.id),
      position: newOrder.includes(item.id) ? newOrder.indexOf(item.id) + 1 : null
    }));
    setItems(updatedItems);

    onOrderChange(newOrder.join(','));
  };

  const handleUndo = () => {
    if (isAnswered) return;
    if (selectedOrder.length === 0) return;

    const newOrder = selectedOrder.slice(0, -1);
    setSelectedOrder(newOrder);

    const updatedItems = items.map(item => ({
      ...item,
      isSelected: newOrder.includes(item.id),
      position: newOrder.includes(item.id) ? newOrder.indexOf(item.id) + 1 : null
    }));
    setItems(updatedItems);

    onOrderChange(newOrder.join(',') || null);
  };

  const handleReset = () => {
    if (isAnswered) return;
    setSelectedOrder([]);
    const resetItems = items.map(item => ({
      ...item,
      isSelected: false,
      position: null
    }));
    setItems(resetItems);
    onOrderChange(null);
  };

  const orderedItems = items.filter(item => item.isSelected).sort((a, b) => a.position - b.position);
  const remainingItems = items.filter(item => !item.isSelected);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                orderedItems.length >= num
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {orderedItems.length} / 5 ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ
        </div>
      </div>

      {orderedItems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 text-lg">📋</span>
            <p className="text-xs font-semibold text-blue-800">ನಿಮ್ಮ ಕ್ರಮ:</p>
            <div className="flex-1"></div>
            <button
              onClick={handleUndo}
              disabled={isAnswered || orderedItems.length === 0}
              className="text-xs text-gray-500 hover:text-blue-600 disabled:opacity-50"
            >
              ← ಹಿಂದಕ್ಕೆ
            </button>
            <button
              onClick={handleReset}
              disabled={isAnswered || orderedItems.length === 0}
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              ಮರುಹೊಂದಿಸಿ
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span className="font-bold">{item.position}.</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="text-lg">👆</span>
          ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಆಯ್ಕೆಗಳನ್ನು ಒತ್ತಿರಿ
        </p>
        
        {remainingItems.length > 0 ? (
          remainingItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              disabled={isAnswered || selectedOrder.length === 5}
              className={`w-full p-4 rounded-xl text-left transition-all transform ${
                isAnswered || selectedOrder.length === 5
                  ? 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
              } flex items-center gap-4`}
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0">
                {item.kannadaLetter}
              </div>
              <span className="flex-1 text-sm text-gray-700">{item.text}</span>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                →
              </div>
            </button>
          ))
        ) : (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-green-700">ಎಲ್ಲಾ ಆಯ್ಕೆಗಳನ್ನು ಕ್ರಮಗೊಳಿಸಲಾಗಿದೆ!</p>
            <p className="text-xs text-green-600 mt-1">"ಉತ್ತರ ಸಲ್ಲಿಸಿ" ಒತ್ತಿರಿ</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-lg">💡</span>
          <span>ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಆಯ್ಕೆಗಳನ್ನು ಆರಿಸಿ. ಹಿಂದಕ್ಕೆ ಅಥವಾ ಮರುಹೊಂದಿಸಬಹುದು.</span>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN QUIZ PAGE =====
export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
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
  const [finalTimeTaken, setFinalTimeTaken] = useState('00:00');
  const [loading, setLoading] = useState(true);

  const normalizeAnswer = (answer) => {
    if (!answer) return '';
    return answer.toString().trim().toLowerCase();
  };

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
        setFinalTimeTaken(parsed.timeTaken || '00:00');
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
        setFinalTimeTaken('00:00');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && !showResults && !showReview && timeLeft > 0 && !quizLocked && !quizCompleted && !loading) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && !quizLocked && !loading) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, showResults, showReview, showExplanation, quizLocked, quizCompleted, loading]);

  const handleAnswerSelect = (answer) => {
    if (quizLocked || quizCompleted || answeredQuestions[currentQuestion]) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (quizLocked || quizCompleted) return;
    
    const currentQ = questions[currentQuestion];
    const isOrdering = currentQ?.questionType === 'ordering';
    
    if (isOrdering) {
      if (!selectedAnswer || selectedAnswer.split(',').length < 5) {
        alert('ದಯವಿಟ್ಟು ಎಲ್ಲಾ 5 ಆಯ್ಕೆಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಿ');
        return;
      }
    } else {
      if (!selectedAnswer && !showExplanation) return;
    }

    if (!showExplanation && selectedAnswer) {
      let isCorrect = false;
      
      if (isOrdering) {
        isCorrect = selectedAnswer === currentQ?.correctOrder;
      } else {
        isCorrect = normalizeAnswer(selectedAnswer) === normalizeAnswer(currentQ?.answer);
      }
      
      if (isCorrect) setScore(prev => prev + 1);
      
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestion] = {
        selected: selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: isOrdering ? currentQ?.correctOrder : currentQ?.answer,
        question: currentQ?.question,
        options: currentQ?.options,
        explanation: currentQ?.explanation,
        questionType: currentQ?.questionType
      };
      setUserAnswers(newUserAnswers);
      
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
      setSelectedAnswer(null);
      setAnsweredQuestions(prev => ({ ...prev, [currentQuestion]: true }));
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(120);
      } else {
        calculateScore();
      }
    }
  };

  const calculateScore = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer) {
        const q = questions[idx];
        if (q?.questionType === 'ordering') {
          if (answer === q.correctOrder) finalScore++;
        } else {
          if (normalizeAnswer(answer) === normalizeAnswer(q?.answer)) finalScore++;
        }
      }
    });
    
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeSpent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    setFinalTimeTaken(timeSpent);
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
          const q = questions[i];
          finalUserAnswers[i] = {
            selected: answers[i],
            isCorrect: q?.questionType === 'ordering' 
              ? answers[i] === q?.correctOrder
              : normalizeAnswer(answers[i]) === normalizeAnswer(q?.answer),
            correctAnswer: q?.questionType === 'ordering' ? q?.correctOrder : q?.answer,
            question: q?.question,
            options: q?.options,
            explanation: q?.explanation,
            questionType: q?.questionType
          };
        }
      }
      
      const hash = questions.map(q => q._id).join(',');
      localStorage.setItem(`quizQuestionsHash_${user.instagramId}`, hash);
      localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
        userAnswers: finalUserAnswers,
        score: finalScore,
        questions: questions,
        completedAt: Date.now(),
        timeTaken: timeSpent
      }));
    }
    
    saveQuizResult(finalScore, timeSpent);
  };

  const saveQuizResult = async (finalScore, timeSpent) => {
    if (!user) return;

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
          timeFormatted: timeSpent,
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

  // ===== RESULT PAGE =====
  if ((quizCompleted && showResults && !showReview) || (quizLocked && !showReview)) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    const wrongCount = (questions.length || 0) - score;
    const displayTime = finalTimeTaken || '00:00';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
        <AdSpace type="native" className="mx-4 mt-2" />
        
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
                <p className="text-[10px] text-gray-400">TIME TAKEN</p>
                <p className="text-xs font-semibold text-gray-700">{displayTime}</p>
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
                      <span className="text-[9px] text-gray-400">Your Ans:</span>
                      <span className={`text-[10px] font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {item.questionType === 'ordering' ? 'Ordered' : item.selected}
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

        <AdSpace type="native" className="mx-4 mt-2" />
        
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

  // ===== REVIEW PAGE =====
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
              const isOrdering = item.questionType === 'ordering';
              
              return (
                <div key={originalIndex} className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-blue-500">
                  <div className="p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[11px] font-bold text-blue-600">Q{originalIndex + 1}</span>
                      {item.isCorrect ? 
                        <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Correct</span> : 
                        <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✗ Wrong</span>
                      }
                      {isOrdering && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🔄 Ordering</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">{item.question}</h3>
                    
                    {isOrdering ? (
                      <div className="space-y-2 mb-2">
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="text-xs font-semibold text-purple-800">Your Order:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selected?.split(',').map((letter, idx) => {
                              const optionIndex = ['a','b','c','d','e'].indexOf(letter);
                              return (
                                <span key={idx} className="inline-flex items-center gap-1 bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs">
                                  {idx + 1}. {item.options?.[optionIndex] || letter}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-xs font-semibold text-green-800">Correct Order:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.correctAnswer?.split(',').map((letter, idx) => {
                              const optionIndex = ['a','b','c','d','e'].indexOf(letter);
                              return (
                                <span key={idx} className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs">
                                  {idx + 1}. {item.options?.[optionIndex] || letter}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 mb-2">
                        {item.options?.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isUserAnswer = normalizeAnswer(item.selected) === normalizeAnswer(opt);
                          const isCorrectAnswer = normalizeAnswer(item.correctAnswer) === normalizeAnswer(opt);
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
                    )}
                    
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
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">← Back to Results</button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold text-center">Study</Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING =====
  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // ===== MAIN QUIZ DISPLAY =====
  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isQuestionAnswered = answeredQuestions[currentQuestion];
  const isOrdering = currentQ?.questionType === 'ordering';

  // Check if user has already answered this question before showing it
  const isAlreadyAnswered = userAnswers[currentQuestion] !== null && userAnswers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="max-w-md mx-auto px-4 py-3">
        
        {/* Date Display */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-4 border border-gray-100">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                <span className="text-blue-600 text-sm font-bold">📅</span>
              </div>
              <p className="text-[10px] text-gray-400">DATE</p>
              <p className="text-xs font-semibold text-gray-700">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 mb-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide">Time Remaining</p>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-[10px] text-gray-400 mt-1">of {totalQuestions}</p>
        </div>

        {/* Question Card */}
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
              {isOrdering && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🔄 ಕ್ರಮಾಂಕ</span>
              )}
              {isAlreadyAnswered && !showExplanation && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✅ Answered</span>
              )}
            </div>
          </div>
          
          {isOrdering ? (
            <OrderingQuestion 
              question={currentQ}
              onOrderChange={(order) => {
                setSelectedAnswer(order);
              }}
              isAnswered={isQuestionAnswered || showExplanation || isAlreadyAnswered}
            />
          ) : (
            <div className="p-3 space-y-2">
              {currentQ?.options?.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedAnswer === opt;
                const showCorrect = showExplanation && normalizeAnswer(opt) === normalizeAnswer(currentQ?.answer);
                const showWrong = showExplanation && isSelected && normalizeAnswer(opt) !== normalizeAnswer(currentQ?.answer);
                const isDisabled = showExplanation || quizLocked || isQuestionAnswered || isAlreadyAnswered;
                
                // Check if this was the user's previously selected answer
                const wasUserAnswer = isAlreadyAnswered && userAnswers[currentQuestion]?.selected === opt;
                
                let bgClass = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
                if (showCorrect) bgClass = 'bg-green-50 border-green-400';
                if (showWrong) bgClass = 'bg-red-50 border-red-400';
                if (isSelected && !showExplanation && !isQuestionAnswered && !isAlreadyAnswered) bgClass = 'bg-green-50 border-green-400';
                if (wasUserAnswer && !showExplanation) bgClass = 'bg-blue-50 border-blue-400';
                
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
                        wasUserAnswer ? 'bg-blue-600 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {letter}
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{opt}</span>
                      {showCorrect && <span className="text-green-600 text-xs">✓ Correct</span>}
                      {showWrong && <span className="text-red-600 text-xs">✗ Wrong</span>}
                      {wasUserAnswer && !showExplanation && (
                        <span className="text-blue-600 text-xs">✓ Your Answer</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">i</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-blue-800">Explanation</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  {currentQ?.explanation || `The correct answer is ${isOrdering ? currentQ?.correctOrder : currentQ?.answer}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleSubmitAnswer} 
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              (isOrdering ? (selectedAnswer && selectedAnswer.split(',').length === 5) : selectedAnswer) ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 
              isAlreadyAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
              'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`} 
            disabled={
              (!showExplanation && !selectedAnswer) || 
              quizLocked || 
              (isOrdering && selectedAnswer && selectedAnswer.split(',').length < 5) ||
              isAlreadyAnswered
            }
          >
            {showExplanation ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →') : isAlreadyAnswered ? '✅ Already Answered' : '✓ Submit Answer'}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-[9px] text-gray-400 mt-4">
          🔒 One attempt per question set • New quiz when admin adds questions
        </p>
      </div>

      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Bottom Navigation */}
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