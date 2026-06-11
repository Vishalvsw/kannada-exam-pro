export const dynamic = "force-dynamic";\n
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all current affairs (for admin panel)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    // Convert dates to simple format
    const formattedAffairs = affairs.map(affair => ({
      ...affair,
      date: affair.date ? affair.date.split('T')[0] : affair.date
    }));
    
    return NextResponse.json(formattedAffairs);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add new current affair
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Ensure date is in YYYY-MM-DD format
    let dateString = body.date;
    if (!dateString || dateString.includes('T')) {
      dateString = dateString ? dateString.split('T')[0] : new Date().toISOString().split('T')[0];
    }
    
    const newAffair = {
      title: body.title,
      title_en: body.title_en || '',
      content: body.content,
      content_en: body.content_en || '',
      date: dateString,
      category: body.category || 'General',
      important: body.important || false,
      source: body.source || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("currentaffairs").insertOne(newAffair);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      ...newAffair 
    }, { status: 201 });
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update existing current affair
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    
    if (!objectId) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Fix date format if needed
    if (updateData.date && updateData.date.includes('T')) {
      updateData.date = updateData.date.split('T')[0];
    }
    
    const result = await db.collection("currentaffairs").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove current affair
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("currentaffairs").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}