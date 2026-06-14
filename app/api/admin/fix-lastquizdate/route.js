import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    console.log('Starting lastQuizDate fix...');
    
    // Get today's date start
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all quiz results from today
    const todayQuizResults = await db.collection('quizresults').find({ 
      date: { $gte: today } 
    }).toArray();
    
    // Get unique users from today's results
    const uniqueUsers = [...new Set(todayQuizResults.map(r => r.instagramId || r.userId).filter(Boolean))];
    
    console.log(`Found ${uniqueUsers.length} users who took quiz today`);
    
    let updatedCount = 0;
    
    // Update each user's lastQuizDate
    for (const userId of uniqueUsers) {
      const result = await db.collection('users').updateOne(
        { instagramId: userId },
        { $set: { lastQuizDate: new Date() } }
      );
      if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }
    
    // Also update all users who have quiz results but no lastQuizDate
    const allQuizTakers = await db.collection('quizresults').aggregate([
      { $match: { instagramId: { $ne: null } } },
      { $group: { _id: "$instagramId", lastQuiz: { $max: "$date" } } }
    ]).toArray();
    
    let bulkUpdated = 0;
    for (const taker of allQuizTakers) {
      if (taker._id) {
        const result = await db.collection('users').updateOne(
          { instagramId: taker._id, lastQuizDate: { $exists: false } },
          { $set: { lastQuizDate: taker.lastQuiz || new Date() } }
        );
        if (result.modifiedCount > 0) bulkUpdated++;
      }
    }
    
    // Also update any user with score > 0 but no lastQuizDate
    const usersWithoutDate = await db.collection('users').find({
      score: { $gt: 0 },
      lastQuizDate: { $exists: false }
    }).toArray();
    
    let usersUpdated = 0;
    for (const user of usersWithoutDate) {
      const result = await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { lastQuizDate: new Date() } }
      );
      if (result.modifiedCount > 0) usersUpdated++;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Last quiz date fix completed',
      todayUsers: uniqueUsers.length,
      updatedToday: updatedCount,
      bulkUpdated: bulkUpdated,
      usersWithoutDateUpdated: usersUpdated,
      totalUpdated: updatedCount + bulkUpdated + usersUpdated
    });
  } catch (error) {
    console.error('Error fixing lastQuizDate:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
