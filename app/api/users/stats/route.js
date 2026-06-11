
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import QuizResult from '@/models/QuizResult';
import { getUsers as getMockUsers, getResults as getMockResults } from '@/lib/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const instagramId = searchParams.get('instagramId');
    const conn = await connectDB();
    
    if (conn) {
      const user = await User.findOne({ instagramId });
      if (!user) return NextResponse.json({ totalScore: 0, totalQuizzes: 0, correctAnswers: 0, wrongAnswers: 0, accuracy: 0, quizHistory: [] });
      
      const results = await QuizResult.find({ instagramId }).sort({ date: -1 });
      let totalScore = 0, totalCorrect = 0, totalWrong = 0;
      results.forEach(r => { totalScore += r.score || 0; totalCorrect += r.score || 0; totalWrong += (r.totalQuestions - r.score) || 0; });
      const accuracy = results.length > 0 ? ((totalCorrect / (totalCorrect + totalWrong)) * 100).toFixed(1) : 0;
      
      return NextResponse.json({
        totalScore: user.score || 0,
        totalQuizzes: user.totalQuizzesTaken || 0,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        accuracy,
        quizHistory: results.slice(0, 10).map(r => ({ score: r.score, totalQuestions: r.totalQuestions, percentage: r.percentage, date: r.date, timeFormatted: r.timeFormatted }))
      });
    }
    
    const users = getMockUsers() || [];
    const results = getMockResults() || [];
    const user = users.find(u => u.instagramId === instagramId);
    if (!user) return NextResponse.json({ totalScore: 0, totalQuizzes: 0, correctAnswers: 0, wrongAnswers: 0, accuracy: 0, quizHistory: [] });
    
    const userResults = results.filter(r => r.instagramId === instagramId);
    let totalScore = 0, totalCorrect = 0, totalWrong = 0;
    userResults.forEach(r => { totalScore += r.score || 0; totalCorrect += r.score || 0; totalWrong += (r.totalQuestions - r.score) || 0; });
    const accuracy = userResults.length > 0 ? ((totalCorrect / (totalCorrect + totalWrong)) * 100).toFixed(1) : 0;
    
    return NextResponse.json({
      totalScore: user.score || 0,
      totalQuizzes: user.totalQuizzesTaken || 0,
      correctAnswers: totalCorrect,
      wrongAnswers: totalWrong,
      accuracy,
      quizHistory: userResults.slice(0, 10).map(r => ({ score: r.score, totalQuestions: r.totalQuestions, percentage: r.percentage, date: r.date, timeFormatted: r.timeFormatted }))
    });
  } catch (error) {
    return NextResponse.json({ totalScore: 0, totalQuizzes: 0, correctAnswers: 0, wrongAnswers: 0, accuracy: 0, quizHistory: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { instagramId, name, score, totalQuestions, percentage, timeFormatted, userEmail } = body;
    const conn = await connectDB();
    
    if (conn) {
      let user = await User.findOne({ instagramId });
      if (user) {
        user.score = (user.score || 0) + score;
        user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
        await user.save();
      } else {
        user = await User.create({
          name: name || instagramId,
          instagramId: instagramId,
          email: userEmail,
          score: score,
          totalQuizzesTaken: 1,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || instagramId)}&background=3B82F6&color=fff&size=100`
        });
      }
      await QuizResult.create({ instagramId, userName: name || instagramId, userEmail, score, totalQuestions, percentage, timeFormatted });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
