import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// ✅ Disable caching for leaderboard API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get all users with scores > 0
    let users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    console.log(`Leaderboard API: Found ${users.length} users with scores > 0`);
    
    // Also include users who have quiz results but might not be in users collection
    const quizResults = await db.collection('quizresults').aggregate([
      { $group: { _id: "$instagramId", totalScore: { $sum: "$score" }, count: { $sum: 1 } } },
      { $match: { totalScore: { $gt: 0 } } }
    ]).toArray();
    
    // Merge any missing users from quiz results
    for (const quizUser of quizResults) {
      if (quizUser._id && !users.find(u => u.instagramId === quizUser._id)) {
        users.push({
          instagramId: quizUser._id,
          name: quizUser._id,
          score: quizUser.totalScore,
          totalQuizzesTaken: quizUser.count,
          lastQuizDate: new Date()
        });
      }
    }
    
    // Re-sort after merge
    users.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Format users
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || user.instagramId || 'Anonymous',
      instagramId: user.instagramId || 'user',
      score: user.score || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      lastQuizDate: user.lastQuizDate,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.instagramId || 'User')}&background=8b5cf6&color=fff`,
    }));
    
    return NextResponse.json(formattedUsers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
