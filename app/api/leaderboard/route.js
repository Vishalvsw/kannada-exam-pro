import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get users with scores, sorted by score descending
    let users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(50)
      .toArray();
    
    // If no users with scores, return empty array
    if (!users || users.length === 0) {
      return NextResponse.json([]);
    }
    
    // Format user data for leaderboard
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Anonymous User',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff`,
      createdAt: user.createdAt,
      lastQuizDate: user.lastQuizDate
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}
