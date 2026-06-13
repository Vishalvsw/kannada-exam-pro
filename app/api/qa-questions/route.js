import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Use the correct collection with 50 questions
    const collection = db.collection('qaquestions');
    const questions = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    console.log(`Public Q&A: Found ${questions.length} questions`);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Q&A GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const collection = db.collection('qaquestions');
    
    const newQuestion = {
      question: body.question,
      question_en: body.question_en || '',
      answer: body.answer,
      answer_en: body.answer_en || '',
      category: body.category || 'General',
      important: body.important || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newQuestion);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
