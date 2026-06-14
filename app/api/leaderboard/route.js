import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh');
    const timestamp = searchParams.get('t');
    
    const client = await clientPromise;
    const db = client.db();
    
    // Get all users with scores > 0
    const users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    // Format users for leaderboard
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Anonymous',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=fff`,
      createdAt: user.createdAt,
      lastQuizDate: user.lastQuizDate
    }));
    
    // Force no caching
    return NextResponse.json(formattedUsers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
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
