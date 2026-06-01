import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL notes (remove any filters)
    const notes = await db.collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`📝 Returning ${notes.length} notes to user`);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json([]);
  }
}
