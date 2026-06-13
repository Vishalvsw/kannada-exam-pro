import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const collection = db.collection('qaquestions');
    const questions = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    console.log(`Admin Q&A: Found ${questions.length} questions`);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Q&A GET error:', error);
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
    console.log(`Admin Q&A: Added new question with ID: ${result.insertedId}`);
    
    return NextResponse.json({ success: true, id: result.insertedId, question: newQuestion });
  } catch (error) {
    console.error('Admin Q&A POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const collection = db.collection('qaquestions');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    console.log(`Admin Q&A: Updated question with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Q&A PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const collection = db.collection('qaquestions');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    console.log(`Admin Q&A: Deleted question with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Q&A DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
