import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { instagramId, name, email, newScore, totalScore, quizzesTaken, percentage } = await request.json();
    
    console.log(`Updating score for: ${instagramId}, newScore: ${newScore}`);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find user by instagramId or email
    let user = await db.collection('users').findOne({ instagramId: instagramId });
    if (!user && email) {
      user = await db.collection('users').findOne({ email: email });
    }
    
    if (user) {
      const updated = await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            score: totalScore || (user.score + newScore),
            totalQuizzesTaken: quizzesTaken || (user.totalQuizzesTaken + 1),
            lastQuizDate: new Date(),  // ← Update last quiz date
            updatedAt: new Date()
          }
        }
      );
      console.log(`✅ User ${instagramId} score updated, lastQuizDate set to now`);
      return NextResponse.json({ success: true });
    } else {
      // Create new user
      const newUser = {
        name: name,
        instagramId: instagramId,
        email: email,
        score: newScore || 0,
        totalQuizzesTaken: 1,
        lastQuizDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('users').insertOne(newUser);
      console.log(`✅ New user created: ${instagramId}`);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
