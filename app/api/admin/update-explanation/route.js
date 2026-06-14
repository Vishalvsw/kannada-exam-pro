import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { questionId, explanation } = await request.json();
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(questionId) },
      { 
        $set: { 
          explanation: explanation || 'No explanation provided.',
          updatedAt: new Date(),
          updatedBy: "admin"
        } 
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Explanation updated successfully",
      modified: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating explanation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
