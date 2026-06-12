import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const totalUsers = await db.collection('users').countDocuments();
    const totalQuizzes = await db.collection('quizresults').countDocuments();
    const topUsers = await db.collection('users')
      .find({})
      .sort({ score: -1 })
      .limit(10)
      .toArray();
    
    return NextResponse.json({
      totalUsers,
      totalQuizzes,
      topUsers
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
