import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    let currentAffairs = await db.collection('currentaffairs')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Current Affairs error:', error);
    return NextResponse.json([]);
  }
}
