import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL current affairs
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    // CRITICAL: Convert ISO dates to simple YYYY-MM-DD format
    const formattedAffairs = affairs.map(affair => ({
      ...affair,
      date: affair.date ? affair.date.split('T')[0] : affair.date
    }));
    
    console.log(`📰 User API returning ${formattedAffairs.length} records with simple dates`);
    return NextResponse.json(formattedAffairs);
  } catch (error) {
    console.error('Current Affairs API Error:', error);
    return NextResponse.json([]);
  }
}