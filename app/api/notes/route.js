import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const notes = await db.collection('notes').find({}).sort({ createdAt: -1 }).toArray();
    
    console.log(`Notes API: Found ${notes.length} notes`);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newNote = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('notes').insertOne(newNote);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Notes POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
