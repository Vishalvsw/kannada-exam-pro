import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    let questions = await db.collection('qaoquestions').find({}).toArray();
    
    if (questions.length === 0) {
      questions = await db.collection('qaQuestions').find({}).toArray();
    }
    
    console.log(`Admin Q&A: Found ${questions.length} questions`);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Q&A error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('qaoquestions').insertOne(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('qaoquestions').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
