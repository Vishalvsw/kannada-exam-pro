
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { instagramId, quizScore } = await request.json();
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const user = await db.collection("users").findOne({ instagramId: instagramId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const updatedScore = (user.score || 0) + (quizScore || 0);
    const updatedQuizzes = (user.totalQuizzesTaken || 0) + 1;
    
    await db.collection("users").updateOne(
      { instagramId: instagramId },
      { 
        $set: { 
          score: updatedScore,
          totalQuizzesTaken: updatedQuizzes,
          lastQuizDate: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true, score: updatedScore });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
