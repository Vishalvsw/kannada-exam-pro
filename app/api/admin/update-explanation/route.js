export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    const { id, explanation } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { explanation } }
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
