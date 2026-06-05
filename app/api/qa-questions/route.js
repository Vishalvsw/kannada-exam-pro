import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL Q&A questions - NO FILTERING
    const qaQuestions = await db.collection("qaquestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Format ALL questions - preserve everything
    const formattedQA = qaQuestions.map(qa => ({
      _id: qa._id.toString(),
      question: qa.question || '',
      question_en: qa.question_en || '',
      answer: qa.answer || '',
      answer_en: qa.answer_en || '',
      category: qa.category || 'General',
      important: qa.important || false,
      createdAt: qa.createdAt,
      updatedAt: qa.updatedAt
    }));
    
    return NextResponse.json(formattedQA);
  } catch (error) {
    console.error('QA Questions API Error:', error);
    return NextResponse.json([]);
  }
}