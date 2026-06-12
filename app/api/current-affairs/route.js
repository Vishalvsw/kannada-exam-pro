import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Try multiple possible collection names
    let currentAffairs = [];
    const possibleNames = ['currentaffairs', 'currentAffairs', 'current_affairs'];
    
    for (const name of possibleNames) {
      const collection = db.collection(name);
      const count = await collection.countDocuments();
      if (count > 0) {
        currentAffairs = await collection.find({}).sort({ date: -1 }).toArray();
        console.log(`Found data in collection: ${name}`);
        break;
      }
    }
    
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Current Affairs API error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
  }
}
