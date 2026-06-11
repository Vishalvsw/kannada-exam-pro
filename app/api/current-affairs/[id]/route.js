
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const affair = await db.collection('currentAffairs').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(affair);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
EOF# Fix current-affairs/[id]/route.js
cat > app/api/current-affairs/[id]/route.js << 'EOF'

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const affair = await db.collection('currentAffairs').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(affair);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
