import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const affairs = await db.collection('currentaffairs').find({}).sort({ date: -1 }).toArray();
    console.log(`Admin API: Found ${affairs.length} current affairs`);
    return NextResponse.json(affairs);
  } catch (error) {
    console.error('Admin Current Affairs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('currentaffairs').insertOne(body);
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
