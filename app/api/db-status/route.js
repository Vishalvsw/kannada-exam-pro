import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const stats = {
      currentAffairs: await db.collection('currentaffairs').countDocuments(),
      notes: await db.collection('notes').countDocuments(),
      users: await db.collection('users').countDocuments(),
      status: 'connected'
    };
    
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
