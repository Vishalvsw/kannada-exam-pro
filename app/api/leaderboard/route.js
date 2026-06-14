import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Optimized query with projection (only needed fields)
    const users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .project({ name: 1, instagramId: 1, score: 1, totalQuizzesTaken: 1, profileImage: 1 })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      }
    });
  } catch (error) {
    return NextResponse.json([]);
  }
}
