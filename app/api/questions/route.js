import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const questions = await db.collection('questions').find({}).toArray();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received question data:', body);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate required fields
    if (!body.question || !body.options || !body.correctAnswer) {
      return NextResponse.json({ 
        error: 'Missing required fields: question, options, or correctAnswer' 
      }, { status: 400 });
    }
    
    // Format the question properly
    const newQuestion = {
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('questions').insertOne(newQuestion);
    console.log('Question saved with ID:', result.insertedId);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      question: newQuestion
    });
  } catch (error) {
    console.error('POST questions error:', error);
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
    const db = client.db();
    
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT questions error:', error);
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
    const db = client.db();
    
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
