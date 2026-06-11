export const dynamic = "force-dynamic";\n
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// ========== GET - Fetch all QA questions for admin ==========
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
      createdAt: qa.createdAt,
      updatedAt: qa.updatedAt
    }));
    
    return NextResponse.json(formattedQA);
  } catch (error) {
    console.error('Admin QA GET Error:', error);
    return NextResponse.json([]);
  }
}

// ========== POST - Add new QA question ==========
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
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId.toString(), 
      ...newQA 
    });
  } catch (error) {
    console.error('Admin QA POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========== PUT - Update existing QA question ==========
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    
    if (!objectId) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const updatedQA = {
      question: updateData.question,
      question_en: updateData.question_en || '',
      answer: updateData.answer,
      answer_en: updateData.answer_en || '',
      category: updateData.category || 'General',
      important: updateData.important === 'true' || updateData.important === true,
      updatedAt: new Date()
    };
    
    const result = await db.collection("qaquestions").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: updatedQA }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      modified: result.modifiedCount,
      _id: objectId,
      ...updatedQA
    });
  } catch (error) {
    console.error('Admin QA PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========== DELETE - Remove QA question ==========
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("qaquestions").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin QA DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}