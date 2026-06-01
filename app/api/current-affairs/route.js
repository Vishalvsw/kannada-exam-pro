import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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
    console.error('Current Affairs API Error:', error);
    return NextResponse.json([]);
  }
}
