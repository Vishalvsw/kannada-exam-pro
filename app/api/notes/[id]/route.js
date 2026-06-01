import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const note = await db.collection("notes").findOne({ _id: new ObjectId(id) });
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error('Note detail API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
