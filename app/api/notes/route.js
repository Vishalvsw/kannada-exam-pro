import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL notes
    const notes = await db.collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // ✅ Format notes for frontend (convert ObjectId to string)
    const formattedNotes = notes.map(note => ({
      _id: note._id.toString(),
      title: note.title || 'Untitled',
      title_en: note.title_en || '',
      content: note.content || 'No content available',
      content_en: note.content_en || '',
      category: note.category || 'General',
      important: note.important || false,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));
    
    console.log(`📝 User API returning ${formattedNotes.length} notes`);
    
    // ✅ Add no-cache headers
    return NextResponse.json(formattedNotes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json([]);
  }
}