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
            <div className="text-center"><div className="text-2xl mb-1">📅</div><p className="text-[10px]">DATE</p><p className="text-sm font-semibold">{formattedDate}</p></div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center"><div className="text-2xl mb-1">⏱️</div><p className="text-[10px]">DURATION</p><p className="text-sm font-semibold">{duration}</p></div>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 mb-4 text-white text-center">
            <div className="text-5xl mb-1">🏆</div>
            <p className="text-sm">Your Score</p>
            <div className="text-5xl font-bold">{score}</div>
            <p className="text-lg">out of {questions.length}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm">{percent}%</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow"><div className="text-3xl mb-1">✅</div><div className="text-2xl font-bold text-green-600">{score}</div><p className="text-xs">Correct</p></div>
            <div className="bg-white rounded-xl p-3 text-center shadow"><div className="text-3xl mb-1">❌</div><div className="text-2xl font-bold text-red-600">{wrong}</div><p className="text-xs">Wrong</p></div>
          </div>

          {/* Locked Message */}
          <div className="bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200">
            <div className="flex items-center gap-2"><div className="text-2xl">🔒</div><div><p className="text-sm font-semibold">Quiz Completed!</p><p className="text-xs">New quiz when admin adds questions</p></div></div>
          </div>

          {/* Answer Preview */}
          <div className="mb-4">
            <h2 className="font-bold mb-2">📋 Your Answers</h2>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {userAnswers.filter(a => a !== null).map((item, idx) => {
                const originalIdx = userAnswers.findIndex(a => a === item);
                return (
                  <div key={originalIdx} className={`bg-white rounded-lg p-2 shadow cursor-pointer border-l-4 ${item.isCorrect ? 'border-green-500' : 'border-red-500'}`}
                    onClick={() => { setCurrentIndex(originalIdx); setShowResult(false); setQuizDone(false); setQuizLocked(false); setShowReview(true); }}>
                    <div className="flex justify-between text-xs mb-1"><span className="font-bold">Q{originalIdx + 1}</span><span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>{item.isCorrect ? '✓' : '✗'}</span></div>
                    <p className="text-[11px] line-clamp-2">{item.question?.substring(0, 50)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Ans: {item.selected}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button onClick={() => setShowReview(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Review</button>
            <Link href="/" className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold text-center">Home</Link>
            <Link href="/notes" className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold text-center">Study</Link>
          </div>
        </div>
        <AdSpace type="banner" className="mx-4 mt-4" />
        
        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
          <div className="flex justify-around max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center"><span className="text-xl">⌂</span><span className="text-[10px]">Home</span></Link>
            <Link href="/quiz" className="flex flex-col items-center"><span className="text-xl">◉</span><span className="text-[10px]">Quiz</span></Link>
            <Link href="/notes" className="flex flex-col items-center"><span className="text-xl">◻</span><span className="text-[10px]">Notes</span></Link>
            <Link href="/current-affairs" className="flex flex-col items-center"><span className="text-xl">◈</span><span className="text-[10px]">News</span></Link>
            <Link href="/leaderboard" className="flex flex-col items-center"><span className="text-xl">⌗</span><span className="text-[10px]">Rank</span></Link>
            <Link href="/profile" className="flex flex-col items-center"><span className="text-xl">⍟</span><span className="text-[10px]">Profile</span></Link>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-6 text-center"><div className="text-5xl mb-1">📋</div><h1 className="text-xl font-bold">Answer Review</h1></div>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2 mb-4 bg-white rounded-xl p-1">
            <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All ({userAnswers.filter(a => a !== null).length})</button>
            <button onClick={() => setFilter('wrong')} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${filter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Wrong ({wrongCount})</button>
            <button onClick={() => setFilter('correct')} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${filter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Correct ({correctCount})</button>
          </div>
          
          <div className="space-y-3 pb-24">
            {filtered.map((item, idx) => {
              const original = userAnswers.findIndex(a => a === item);
              return (
                <div key={original} className="bg-white rounded-xl shadow overflow-hidden border-l-4 border-blue-500 p-3">
                  <div className="flex justify-between text-xs mb-2"><span className="font-bold text-blue-600">Q{original + 1}</span>{item.isCorrect ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">✓ Correct</span> : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px]">✗ Wrong</span>}</div>
                  <h3 className="font-semibold text-sm mb-2">{item.question}</h3>
                  <div className="space-y-1 mb-2">
                    {item.options?.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isUser = item.selected === opt;
                      const isCorrect = item.correctAnswer === opt;
                      let bg = 'bg-gray-50';
                      if (isCorrect) bg = 'bg-green-100';
                      if (isUser && !isCorrect) bg = 'bg-red-100';
                      return <div key={optIdx} className={`p-2 rounded-lg ${bg} text-xs`}><span className="font-medium">{letter}.</span> {opt}{isCorrect && <span className="text-green-600 ml-1">✓</span>}{isUser && !isCorrect && <span className="text-red-600 ml-1">✗ Your Answer</span>}</div>;
                    })}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2"><p className="text-[10px] font-semibold">Explanation:</p><p className="text-xs mt-1">{item.explanation || `Correct: ${item.correctAnswer}`}</p></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
          <div className="flex gap-3 max-w-md mx-auto"><button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">← Back</button><Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold text-center">Study</Link></div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;
  if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center"><div className="text-6xl mb-3">📝</div><h2 className="text-xl font-bold">No Questions</h2><Link href="/" className="text-green-600 mt-4 inline-block">← Back</Link></div></div>;

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const hasAnswered = answers[currentIndex] !== null;

  // ========== ACTIVE QUIZ PAGE ==========
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      <div className="max-w-md mx-auto px-4 py-4">
        
        {/* Date & Time */}
        <div className="bg-white rounded-xl shadow p-3 mb-4 flex justify-around">
          <div className="text-center"><div className="text-2xl mb-1">📅</div><p className="text-[10px]">DATE</p><p className="text-sm font-semibold">{formattedDate}</p></div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center"><div className="text-2xl mb-1">⏰</div><p className="text-[10px]">TIME</p><p className="text-sm font-semibold">{formattedClock}</p></div>
        </div>

        {/* Timer */}
        <div className="bg-white rounded-xl p-3 text-center shadow mb-4"><p className="text-xs text-gray-400">Time Remaining</p><div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-green-600'}`}>{formatTime(timeLeft)}</div></div>

        {/* Progress */}
        <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span>Question {currentIndex + 1} of {total}</span><span className="text-green-600 font-bold">{Math.round(progress)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-green-500" style={{ width: `${progress}%` }}></div></div></div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-4">
          <div className="p-4 bg-green-50 border-b"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">{currentIndex + 1}</div><h2 className="font-semibold text-gray-800 flex-1">{currentQ?.question}</h2>{hasAnswered && <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><span className="text-green-600 text-xs">✓</span></div>}</div></div>
          <div className="p-3 space-y-2">
            {currentQ?.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === opt;
              const showCorrect = showExplanation && opt === currentQ?.answer;
              const showWrong = showExplanation && isSelected && opt !== currentQ?.answer;
              const disabled = showExplanation || quizLocked || hasAnswered;
              
              let bg = 'bg-white border hover:border-green-400 hover:bg-green-50';
              if (showCorrect) bg = 'bg-green-100 border-green-500';
              if (showWrong) bg = 'bg-red-100 border-red-500';
              if (isSelected && !showExplanation && !hasAnswered) bg = 'bg-green-100 border-green-500';
              
              return (
                <button key={idx} onClick={() => !disabled && selectAnswer(opt)} disabled={disabled} className={`w-full p-3 rounded-xl text-left transition ${bg} ${disabled ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${showCorrect || (isSelected && !disabled) ? 'bg-green-600 text-white' : showWrong ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{letter}</div>
                    <span className="text-sm text-gray-700 flex-1">{opt}</span>
                    {showCorrect && <span className="text-green-600 text-xs">✓</span>}
                    {showWrong && <span className="text-red-600 text-xs">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
            <div className="flex gap-2"><div className="text-blue-500">💡</div><div><p className="text-xs font-semibold text-blue-800">Explanation</p><p className="text-xs text-blue-700 mt-1">{currentQ?.explanation || `Correct answer: ${currentQ?.answer}`}</p></div></div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {currentIndex > 0 && <button onClick={goPrevious} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold border">← Previous</button>}
          <button onClick={submitAnswer} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${showExplanation ? 'bg-green-600 text-white' : selectedAnswer ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} disabled={(!showExplanation && !selectedAnswer) || quizLocked}>
            {showExplanation ? (currentIndex + 1 === total ? '🏆 Finish' : 'Next →') : '✓ Submit'}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-4">🔒 One attempt per question set • New quiz when admin adds questions</p>
      </div>
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center"><span className="text-xl">⌂</span><span className="text-[10px]">Home</span></Link>
          <Link href="/quiz" className="flex flex-col items-center"><span className="text-xl">◉</span><span className="text-[10px]">Quiz</span></Link>
          <Link href="/notes" className="flex flex-col items-center"><span className="text-xl">◻</span><span className="text-[10px]">Notes</span></Link>
          <Link href="/current-affairs" className="flex flex-col items-center"><span className="text-xl">◈</span><span className="text-[10px]">News</span></Link>
          <Link href="/leaderboard" className="flex flex-col items-center"><span className="text-xl">⌗</span><span className="text-[10px]">Rank</span></Link>
          <Link href="/profile" className="flex flex-col items-center"><span className="text-xl">⍟</span><span className="text-[10px]">Profile</span></Link>
        </div>
      </div>
    </div>
  );
}