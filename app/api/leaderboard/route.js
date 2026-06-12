import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/storage';

export async function GET() {
  try {
    const users = getUsers() || [];
    
    const leaderboard = users
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 50)
      .map(user => ({
        _id: user.id,
        name: user.name || 'Anonymous',
        instagramId: user.instagramId || '',
        score: user.score || 0,
        totalQuizzesTaken: user.totalQuizzesTaken || 0,
        image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3B82F6&color=fff&size=100`
      }));
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
