import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const users = await db.collection("users")
      .find({})
      .sort({ score: -1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
