import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Try multiple collection names
    let users = [];
    const possibleCollections = ['users', 'User', 'Users', 'user'];
    
    for (const collectionName of possibleCollections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        if (count > 0) {
          users = await collection.find({}).toArray();
          console.log(`Users API: Found ${users.length} users in collection: ${collectionName}`);
          break;
        }
      } catch (err) {
        console.log(`Collection ${collectionName} not found`);
      }
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    // Use 'users' collection
    const collection = db.collection('users');
    
    // Check if user exists
    const existingUser = await collection.findOne({ 
      $or: [
        { instagramId: body.instagramId },
        { email: body.email }
      ]
    });
    
    if (existingUser) {
      // Update existing user
      const result = await collection.updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            ...body,
            updatedAt: new Date()
          }
        }
      );
      return NextResponse.json({ success: true, user: existingUser });
    }
    
    // Create new user
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
    console.error('User creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
