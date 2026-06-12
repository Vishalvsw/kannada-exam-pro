import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Try both collection names (fixing the typo)
    let questions = await db.collection('qaoquestions').find({}).toArray();
    
    if (questions.length === 0) {
      questions = await db.collection('qaQuestions').find({}).toArray();
    }
    
    if (questions.length === 0) {
      questions = await db.collection('qaquestions').find({}).toArray();
    }
    
    console.log(`Found ${questions.length} Q&A questions`);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Q&A Questions error:', error);
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
