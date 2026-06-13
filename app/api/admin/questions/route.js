import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const questions = await db.collection('questions').find({}).toArray();
    console.log(`Admin GET: Found ${questions.length} questions`);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin GET questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.question || !body.correctAnswer) {
      return NextResponse.json({ error: 'Question and correct answer are required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQuestion = {
      question: body.question,
      options: body.options || [],
      correctAnswer: body.correctAnswer,
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('questions').insertOne(newQuestion);
    console.log('Admin POST: Question saved with ID:', result.insertedId);
    
    return NextResponse.json({ success: true, id: result.insertedId, question: newQuestion });
  } catch (error) {
    console.error('Admin POST questions error:', error);
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
    
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin PUT questions error:', error);
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
    
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
