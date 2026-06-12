import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all users with scores
    const users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    console.log(`Leaderboard API: Found ${users.length} users with scores`);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
