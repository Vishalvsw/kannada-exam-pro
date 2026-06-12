import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    let currentAffairs = [];
    const possibleNames = ['currentaffairs', 'currentAffairs', 'current_affairs'];
    
    for (const name of possibleNames) {
      const collection = db.collection(name);
      const count = await collection.countDocuments();
      if (count > 0) {
        currentAffairs = await collection.find({}).sort({ date: -1 }).toArray();
        break;
      }
    }
    
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Admin Current Affairs error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('currentaffairs');
    const result = await collection.insertOne({
      ...body,
      date: body.date || new Date().toISOString(),
      createdAt: new Date()
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('currentaffairs').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
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
    const result = await db.collection('currentaffairs').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
