import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const results = await db.collection('quizresults').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(results);
  } catch (error) {
    console.error('GET quiz results error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const quizResult = {
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      instagramId: body.instagramId,
      score: body.score,
      totalQuestions: body.totalQuestions,
      percentage: body.percentage,
      correctCount: body.correctCount,
      wrongCount: body.wrongCount,
      timeTaken: body.timeTaken,
      timeFormatted: body.timeFormatted,
      answers: body.answers || [],
      date: new Date(),
      createdAt: new Date()
    };
    
    const result = await db.collection('quizresults').insertOne(quizResult);
    console.log(`✅ Quiz result saved for: ${body.userName} (${body.instagramId})`);
    
    // CRITICAL: Update user's lastQuizDate and score
    if (body.instagramId) {
      // First, find if user exists
      let user = await db.collection('users').findOne({ instagramId: body.instagramId });
      
      // If user not found by instagramId, try by email
      if (!user && body.userEmail) {
        user = await db.collection('users').findOne({ email: body.userEmail });
      }
      
      if (user) {
        const newTotalScore = (user.score || 0) + (body.score || 0);
        const newQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
        
        await db.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { 
              score: newTotalScore,
              totalQuizzesTaken: newQuizzesTaken,
              lastQuizDate: new Date(),  // ← This is critical!
              updatedAt: new Date()
            }
          }
        );
        console.log(`✅ Updated user ${body.instagramId}: score=${newTotalScore}, lastQuizDate=${new Date().toISOString()}`);
      } else {
        // Create new user if doesn't exist
        const newUser = {
          name: body.userName,
          instagramId: body.instagramId,
          email: body.userEmail,
          score: body.score || 0,
          totalQuizzesTaken: 1,
          lastQuizDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await db.collection('users').insertOne(newUser);
        console.log(`✅ Created new user: ${body.instagramId}`);
      }
    }
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('POST quiz results error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
