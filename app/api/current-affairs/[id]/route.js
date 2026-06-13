import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    let affair = null;
    const collections = ['currentaffairs', 'currentAffairs'];
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        affair = await collection.findOne({ _id: new ObjectId(id) });
        if (affair) break;
      } catch (err) {
        console.log(`Not found in ${collectionName}`);
      }
    }
    
    if (!affair) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(affair);
  } catch (error) {
    console.error('Current Affair detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
