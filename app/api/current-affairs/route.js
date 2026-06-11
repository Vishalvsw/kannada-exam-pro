import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const affairs = await db.collection('currentAffairs')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(affairs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
