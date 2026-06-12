import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('Starting sync from quiz results...');
    
    // Get all quiz results
    const quizResults = await db.collection('quizresults').find({}).toArray();
    console.log(`Found ${quizResults.length} quiz results`);
    
    if (quizResults.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No quiz results found',
        usersCreated: 0,
        usersUpdated: 0,
        totalUsers: 0
      });
    }
    
    // Extract unique users from quiz results
    const userMap = new Map();
    
    for (const result of quizResults) {
      // Get user identifier from available fields
      const userId = result.userId || result.user_id || result.instagramId || result.userName;
      const userName = result.userName || result.name || result.user || 'Anonymous';
      const userInstagram = result.instagramId || result.instagram || userId;
      const userScore = result.score || result.totalScore || 0;
      
      if (!userId && !userInstagram) continue;
      
      const key = userId || userInstagram;
      
      if (!userMap.has(key)) {
        userMap.set(key, {
          name: userName,
          instagramId: userInstagram,
          score: 0,
          totalQuizzesTaken: 0,
          lastQuizDate: result.date || result.createdAt || new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      const user = userMap.get(key);
      user.score += userScore;
      user.totalQuizzesTaken += 1;
      
      const resultDate = result.date || result.createdAt;
      if (resultDate && new Date(resultDate) > new Date(user.lastQuizDate)) {
        user.lastQuizDate = resultDate;
      }
    }
    
    console.log(`Extracted ${userMap.size} unique users from quiz results`);
    
    // Insert/Update users
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const [key, userData] of userMap) {
      const existingUser = await db.collection('users').findOne({ 
        $or: [
          { instagramId: userData.instagramId },
          { name: userData.name }
        ]
      });
      
      if (existingUser) {
        await db.collection('users').updateOne(
          { _id: existingUser._id },
          { 
            $set: {
              score: userData.score,
              totalQuizzesTaken: userData.totalQuizzesTaken,
              lastQuizDate: userData.lastQuizDate,
              updatedAt: new Date()
            }
          }
        );
        updatedCount++;
      } else {
        await db.collection('users').insertOne(userData);
        createdCount++;
      }
    }
    
    const finalUsers = await db.collection('users').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      message: `Processed ${quizResults.length} quiz results`,
      usersCreated: createdCount,
      usersUpdated: updatedCount,
      totalUsers: finalUsers.length,
      sampleUsers: finalUsers.slice(0, 5).map(u => ({
        name: u.name,
        instagramId: u.instagramId,
        score: u.score,
        quizzes: u.totalQuizzesTaken
      }))
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
