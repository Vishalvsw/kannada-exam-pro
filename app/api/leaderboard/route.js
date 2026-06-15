import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const timestamp = searchParams.get('t');
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get current date for filtering
    const now = new Date();
    let dateFilter = {};
    
    switch(filter) {
      case 'today':
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        dateFilter = { lastQuizDate: { $gte: todayStart } };
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        dateFilter = { lastQuizDate: { $gte: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        dateFilter = { lastQuizDate: { $gte: monthAgo } };
        break;
      default:
        dateFilter = {};
    }
    
    // Get users with their scores (from users collection first)
    let users = await db.collection('users')
      .find({ score: { $gt: 0 }, ...dateFilter })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    // If no users found with date filter, get all users with scores
    if (users.length === 0 && filter !== 'all') {
      users = await db.collection('users')
        .find({ score: { $gt: 0 } })
        .sort({ score: -1 })
        .limit(100)
        .toArray();
    }
    
    // Format users for leaderboard
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Anonymous',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      lastQuizDate: user.lastQuizDate,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=fff`,
    }));
    
    return NextResponse.json(formattedUsers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json([]);
  }
}
