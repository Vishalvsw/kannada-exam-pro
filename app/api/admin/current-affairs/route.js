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
    
    // Convert date to YYYY-MM-DD string format
    let dateString = body.date;
    if (body.date && !body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const d = new Date(body.date);
      dateString = d.toISOString().split('T')[0];
    } else if (!body.date) {
      dateString = new Date().toISOString().split('T')[0];
    }
    
    const newAffair = {
      title: body.title,
      title_en: body.title_en || '',
      content: body.content,
      content_en: body.content_en || '',
      date: dateString,
      category: body.category || 'General',
      important: body.important || false,
      source: body.source || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("currentaffairs").insertOne(newAffair);
    
    return NextResponse.json({ success: true, _id: result.insertedId, ...newAffair }, { status: 201 });
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
    
    if (updateData.date && !updateData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const d = new Date(updateData.date);
      updateData.date = d.toISOString().split('T')[0];
    }
    
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
