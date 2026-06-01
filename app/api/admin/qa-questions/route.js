import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const qaQuestions = await db.collection("qaquestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedQA = qaQuestions.map(qa => ({
      _id: qa._id.toString(),
      question: qa.question,
      question_en: qa.question_en || '',
      answer: qa.answer,
      answer_en: qa.answer_en || '',
      category: qa.category || 'General',
      important: qa.important || false,
      createdAt: qa.createdAt
    }));
    
    return NextResponse.json(formattedQA);
  } catch (error) {
    console.error('Admin QA GET Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQA = {
      question: body.question,
      question_en: body.question_en || '',
      answer: body.answer,
      answer_en: body.answer_en || '',
      category: body.category || 'General',
      important: body.important === 'true' || body.important === true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("qaquestions").insertOne(newQA);
    
    return NextResponse.json({ success: true, _id: result.insertedId.toString(), ...newQA });
  } catch (error) {
    console.error('Admin QA POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    await db.collection("qaquestions").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin QA DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
