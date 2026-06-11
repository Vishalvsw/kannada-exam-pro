import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const affair = await db.collection('currentAffairs').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!affair) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(affair);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
