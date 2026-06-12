import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all users with scores, sorted by score
    let users = await db.collection('users')
      .find({})
      .sort({ score: -1 })
      .limit(50)
      .toArray();
    
    // Format the users for leaderboard display
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
    
    // Always return an array (empty if no users)
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    // Return empty array instead of error
    return NextResponse.json([]);
  }
}
