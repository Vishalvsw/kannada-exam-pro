import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    let questions = [];
    const possibleNames = ['qaquestions', 'qaQuestions', 'qaoquestions', 'qaoQuestions'];
    
    for (const name of possibleNames) {
      try {
        const collection = db.collection(name);
        const count = await collection.countDocuments();
        if (count > 0) {
          questions = await collection.find({}).sort({ createdAt: -1 }).toArray();
          console.log(`Found ${questions.length} Q&A in collection: ${name}`);
          break;
        }
      } catch (err) {
        console.log(`Collection ${name} not accessible`);
      }
    }
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Q&A GET error:', error);
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
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newQuestion);
    console.log(`Added new Q&A with ID: ${result.insertedId}`);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Q&A POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
