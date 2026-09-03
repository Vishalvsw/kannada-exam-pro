import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// ✅ Disable caching for notes API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    const notes = await db.collection("notes").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(notes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Admin Notes GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newNote = {
      title: body.title,
      title_en: body.title_en || '',
      content: body.content,
      content_en: body.content_en || '',
      category: body.category || 'General',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("notes").insertOne(newNote);
    
    return NextResponse.json(
      { success: true, _id: result.insertedId },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Admin Notes POST Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const idFromUrl = url.searchParams.get('id');
    const idFromBody = body.id || body._id;
    const noteId = idFromUrl || idFromBody;
    
    if (!noteId) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: 'Invalid note ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const { id, _id, ...updateData } = body;
    
    const result = await db.collection("notes").updateOne(
      { _id: new ObjectId(noteId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Admin Notes PUT Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Admin Notes DELETE Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
