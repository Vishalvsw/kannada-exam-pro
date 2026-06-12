import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users')
      .find({})
      .sort({ score: -1 })
      .limit(50)
      .toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
