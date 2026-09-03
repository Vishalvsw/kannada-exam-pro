import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// ✅ Disable caching for questions API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const questions = await db.collection("questions").find({}).toArray();
    
    return NextResponse.json(questions, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQuestion = {
      question: body.question,
      options: body.options || [],
      answer: body.answer,
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("questions").insertOne(newQuestion);
    
    return NextResponse.json(
      { success: true, _id: result.insertedId },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    console.log('PUT Request Body:', body);
    
    const questionId = body.id || body._id;
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(questionId)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const { id, _id, ...updateData } = body;
    
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(questionId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { success: true, modified: result.modifiedCount },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { success: true, deleted: result.deletedCount },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
