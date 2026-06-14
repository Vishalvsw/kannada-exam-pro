import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    if (userId) {
      query = { $or: [{ userId }, { instagramId: userId }] };
    }
    
    // ONLY fetch last 50 results, not all 4615!
    const results = await db.collection('quizresults')
      .find(query)
      .sort({ date: -1 })
      .limit(limit)
      .toArray();
    
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=60' }
    });
  } catch (error) {
    console.error('GET quiz results error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const quizResult = {
      userName: body.userName,
      userEmail: body.userEmail,
      instagramId: body.instagramId,
      score: body.score,
      totalQuestions: body.totalQuestions,
      percentage: body.percentage,
      correctCount: body.correctCount,
      wrongCount: body.wrongCount,
      timeFormatted: body.timeFormatted,
      date: new Date(),
      createdAt: new Date()
    };
    
    const result = await db.collection('quizresults').insertOne(quizResult);
    
    // Update user's score in background (don't wait)
    if (body.instagramId) {
      const user = await db.collection('users').findOne({ instagramId: body.instagramId });
      if (user) {
        const newScore = (user.score || 0) + (body.score || 0);
        const newQuizzes = (user.totalQuizzesTaken || 0) + 1;
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { score: newScore, totalQuizzesTaken: newQuizzes, lastQuizDate: new Date() } }
        );
      }
    }
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
