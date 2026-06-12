import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    
    const affair = await db.collection('currentaffairs').findOne({
      _id: new ObjectId(id)
    });
    
    if (!affair) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(affair);
  } catch (error) {
    console.error('Error fetching current affair:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
