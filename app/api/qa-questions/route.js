import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Try all possible collection names
    let questions = [];
    const possibleNames = ['qaoquestions', 'qaQuestions', 'qaquestions', 'qaoQuestions'];
    
    for (const name of possibleNames) {
      try {
        const collection = db.collection(name);
        const count = await collection.countDocuments();
        if (count > 0) {
          questions = await collection.find({}).toArray();
          console.log(`Found ${questions.length} Q&A questions in collection: ${name}`);
          break;
        }
      } catch (err) {
        console.log(`Collection ${name} not found`);
      }
    }
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Q&A API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('qaoquestions');
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date()
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
