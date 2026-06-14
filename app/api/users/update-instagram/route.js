import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, oldInstagramId, newInstagramId } = await request.json();
    
    if (!email || !newInstagramId) {
      return NextResponse.json({ error: 'Email and new Instagram ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Update user's Instagram ID
    const result = await db.collection("users").updateOne(
      { email: email },
      { 
        $set: { 
          instagramId: newInstagramId,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Also update quiz results with new Instagram ID
    if (oldInstagramId) {
      await db.collection("quizresults").updateMany(
        { instagramId: oldInstagramId },
        { $set: { instagramId: newInstagramId } }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Instagram ID updated successfully",
      newInstagramId: newInstagramId
    });
  } catch (error) {
    console.error('Error updating Instagram ID:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
