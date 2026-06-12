import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
        console.log(`Collection ${name} not found or empty`);
      }
    }
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Q&A error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    // Use the existing collection name from database
    const collection = db.collection('qaoquestions');
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST error:', error);
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
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('qaoquestions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
