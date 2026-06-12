import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get ALL users, sorted by score
    const users = await db.collection('users')
      .find({})
      .sort({ score: -1 })
      .toArray();
    
    console.log(`Leaderboard API: Found ${users.length} users`);
    
    // Format users
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Anonymous',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff`
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}
