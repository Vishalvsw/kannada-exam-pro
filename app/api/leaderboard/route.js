import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get users with scores
    const users = await db.collection("users")
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Anonymous',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
