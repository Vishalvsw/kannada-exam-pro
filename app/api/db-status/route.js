export const dynamic = "force-dynamic";\n
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getQuestions, getUsers, getCurrentAffairs } from '@/lib/storage';

export async function GET() {
  try {
    const conn = await connectDB();
    
    if (conn && mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      return NextResponse.json({
        success: true,
        database: 'MongoDB Atlas',
        status: 'connected',
        collections: {
          questions: await db.collection('questions').countDocuments(),
          users: await db.collection('users').countDocuments(),
          currentAffairs: await db.collection('currentaffairs').countDocuments(),
          quizResults: await db.collection('quizresults').countDocuments()
        },
        message: '✅ Using MongoDB Atlas (permanent storage)'
      });
    }
    
    return NextResponse.json({
      success: true,
      database: 'In-Memory Storage (storage.js)',
      status: 'connected (fallback)',
      collections: {
        questions: getQuestions()?.length || 0,
        users: getUsers()?.length || 0,
        currentAffairs: getCurrentAffairs()?.length || 0
      },
      message: '⚠️ Using fallback storage. Add MONGODB_URI for permanent storage.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
