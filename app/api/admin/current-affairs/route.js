import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(affairs);
  } catch (error) {
    console.error('Admin Current Affairs GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newAffair = {
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("currentaffairs").insertOne(newAffair);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      id: result.insertedId,
      ...newAffair 
    }, { status: 201 });
  } catch (error) {
    console.error('Admin Current Affairs POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("currentaffairs").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin Current Affairs DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("currentaffairs").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin Current Affairs PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
