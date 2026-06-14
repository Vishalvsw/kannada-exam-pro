import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all users with scores > 0
    const users = await db.collection('users')
      .find({ score: { $gt: 0 } })
      .project({ 
        name: 1, 
        instagramId: 1, 
        score: 1, 
        totalQuizzesTaken: 1, 
        profileImage: 1,
        lastQuizDate: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 1
      })
      .sort({ score: -1 })
      .limit(100)
      .toArray();
    
    // Ensure every user has a lastQuizDate (use createdAt as fallback)
    const formattedUsers = users.map(user => ({
      ...user,
      lastQuizDate: user.lastQuizDate || user.updatedAt || user.createdAt || new Date()
    }));
    
    console.log(`Leaderboard API: Returning ${formattedUsers.length} users with lastQuizDate`);
    
    return NextResponse.json(formattedUsers, {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const { name, instagramId, score, totalQuizzesTaken, profileImage } = await request.json();
    
    const result = await db.collection('users').insertOne({
      name,
      instagramId,
      score,
      totalQuizzesTaken,
      profileImage,
      createdAt: new Date(),
      lastQuizDate: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json({ error: 'Failed to submit leaderboard entry' }, { status: 500 });
  }
}
