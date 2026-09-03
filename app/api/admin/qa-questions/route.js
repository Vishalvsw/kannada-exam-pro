import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// ✅ Disable caching for admin QA questions API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Try both possible collection names
    let questions = await db.collection("qaquestions").find({}).sort({ createdAt: -1 }).toArray();
    if (questions.length === 0) {
      questions = await db.collection("qaoquestions").find({}).sort({ createdAt: -1 }).toArray();
    }
    
    return NextResponse.json(questions, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Admin QA GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A questions' },
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
    
    return NextResponse.json(
      { success: true, _id: result.insertedId },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Admin QA POST Error:', error);
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
    
    // Get ID from URL or body
    const url = new URL(request.url);
    const idFromUrl = url.searchParams.get('id');
    const idFromBody = body.id || body._id;
    const questionId = idFromUrl || idFromBody;
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    // Validate ObjectId
    if (!ObjectId.isValid(questionId)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Remove id fields from update data
    const { id, _id, ...updateData } = body;
    
    const result = await db.collection("qaquestions").updateOne(
      { _id: new ObjectId(questionId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      // Try the other collection name
      const altResult = await db.collection("qaoquestions").updateOne(
        { _id: new ObjectId(questionId) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      if (altResult.matchedCount === 0) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
    }
    
    return NextResponse.json(
      { success: true, modified: result.modifiedCount || 1 },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Admin QA PUT Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Try both collections
    let result = await db.collection("qaquestions").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      result = await db.collection("qaoquestions").deleteOne({ _id: new ObjectId(id) });
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
    console.error('Admin QA DELETE Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
