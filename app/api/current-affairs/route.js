import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Try both possible collection names
    let currentAffairs = await db.collection('currentaffairs').find({}).sort({ date: -1 }).toArray();
    
    if (currentAffairs.length === 0) {
      currentAffairs = await db.collection('currentAffairs').find({}).sort({ date: -1 }).toArray();
    }
    
    console.log(`Found ${currentAffairs.length} current affairs`);
    return NextResponse.json(currentAffairs);
  } catch (error) {
    console.error('Current Affairs error:', error);
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
