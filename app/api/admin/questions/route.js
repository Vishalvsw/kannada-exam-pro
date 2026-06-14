import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all questions
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questions = await db.collection("questions")
      .find({})
      .toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Questions GET Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new question
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQuestion = {
      ...body,
      createdAt: new Date()
    };
    
    const result = await db.collection("questions").insertOne(newQuestion);
    
    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (error) {
    console.error('Admin Questions POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin Questions DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
