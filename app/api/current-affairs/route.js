import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get current affairs from MongoDB
    let currentAffairs = await db.collection('currentaffairs')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    console.log(`Current Affairs API: Found ${currentAffairs.length} items`);
    
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Current Affairs error:', error);
    return NextResponse.json([]);
  }
}
