import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL current affairs (no date filtering)
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    console.log(`📰 Returning ${affairs.length} current affairs to user`);
    return NextResponse.json(affairs);
  } catch (error) {
    console.error('Current Affairs API Error:', error);
    return NextResponse.json([]);
  }
}
