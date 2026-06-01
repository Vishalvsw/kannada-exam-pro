import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL Q&A questions
    const qaQuestions = await db.collection("qaquestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`❓ Returning ${qaQuestions.length} Q&A to user`);
    return NextResponse.json(qaQuestions);
  } catch (error) {
    console.error('QA Questions API Error:', error);
    return NextResponse.json([]);
  }
}
