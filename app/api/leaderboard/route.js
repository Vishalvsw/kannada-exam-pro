import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users')
      .find({})
      .sort({ totalScore: -1 })
      .limit(50)
      .toArray();
    
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
