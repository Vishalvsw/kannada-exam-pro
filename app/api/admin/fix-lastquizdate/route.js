import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Update all users with scores to have lastQuizDate
    const result = await db.collection('users').updateMany(
      { score: { $gt: 0 }, lastQuizDate: { $exists: false } },
      { $set: { lastQuizDate: new Date() } }
    );
    
    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} users`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
