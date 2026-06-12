import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');
    
    const existingUser = await collection.findOne({ 
      $or: [
        { instagramId: body.instagramId },
        { email: body.email }
      ]
    });
    
    if (existingUser) {
      await collection.updateOne(
        { _id: existingUser._id },
        { $set: { ...body, updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, user: existingUser });
    }
    
    const newUser = {
      ...body,
      score: body.score || 0,
      totalQuizzesTaken: body.totalQuizzesTaken || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newUser);
    return NextResponse.json({ success: true, user: { ...newUser, _id: result.insertedId } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE endpoint to remove dummy users
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
