import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    // Add cache-busting timestamp
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh');
    
    const client = await clientPromise;
    const db = client.db();
    
    // Get all users with scores > 0
    const users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    // Add cache control headers to prevent caching
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}
