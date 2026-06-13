import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get all collections to debug
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    let currentAffairs = [];
    const possibleNames = ['currentaffairs', 'currentAffairs', 'current_affairs', 'current-affairs'];
    
    for (const collectionName of possibleNames) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`Collection ${collectionName}: ${count} documents`);
        
        if (count > 0) {
          currentAffairs = await collection
            .find({})
            .sort({ date: -1, createdAt: -1 })
            .toArray();
          console.log(`✅ Found ${currentAffairs.length} items in ${collectionName}`);
          break;
        }
      } catch (err) {
        console.log(`Collection ${collectionName} not accessible`);
      }
    }
    
    // If still empty, try without any filter
    if (currentAffairs.length === 0) {
      for (const collectionName of possibleNames) {
        try {
          const collection = db.collection(collectionName);
          currentAffairs = await collection.find({}).toArray();
          if (currentAffairs.length > 0) break;
        } catch (err) {}
      }
    }
    
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Current Affairs GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const collection = db.collection('currentaffairs');
    
    const newAffair = {
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newAffair);
    console.log(`✅ Added new current affair: ${result.insertedId}`);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Current Affairs POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
