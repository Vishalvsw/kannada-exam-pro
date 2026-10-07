import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 500); // hard cap 500
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('kannada_exam_pro');

    // ✅ Only fetch the fields the admin UI actually needs.
    // This drops the response from ~376 KB to ~30 KB.
    const projection = {
      _id: 1,
      name: 1,
      email: 1,
      instagramId: 1,
      score: 1,
      totalQuizzesTaken: 1,
      lastQuizDate: 1,
      createdAt: 1,
      isAdmin: 1,
      // ❌ Excluded on purpose (these are the big ones):
      // profileImage, picture, bio, password, __v, updatedAt, any base64 avatars
    };

    const [users, total] = await Promise.all([
      db.collection('users')
        .find({}, { projection })
        .sort({ score: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('users').countDocuments(),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json(
      { users: [], total: 0, page: 1, limit: 100, totalPages: 0, error: error.message },
      { status: 200 }
    );
  }
}