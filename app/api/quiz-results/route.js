export const dynamic = "force-dynamic";\n
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const results = await db.collection("quizresults")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Quiz Results API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("quizresults").insertOne({
      ...data,
      createdAt: new Date(),
      date: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Save Quiz Result Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
