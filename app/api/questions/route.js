import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 0;
    const category = searchParams.get('category');
    
    const client = await clientPromise;
    const db = client.db();
    
    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    
    // Get questions
    let questionsQuery = db.collection('questions').find(query);
    
    if (limit > 0) {
      questionsQuery = questionsQuery.limit(limit);
    }
    
    const questions = await questionsQuery.toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Public POST - Received question data:', body);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate required fields
    if (!body.question) {
      return NextResponse.json({ 
        error: 'Missing required field: question' 
      }, { status: 400 });
    }
    
    // Format the question properly
    const newQuestion = {
      question: body.question,
      options: body.options || [],
      correctAnswer: body.correctAnswer || '',
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('questions').insertOne(newQuestion);
    console.log('Public - Question saved with ID:', result.insertedId);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      question: newQuestion
    });
  } catch (error) {
    console.error('POST questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
EOFcat > app/api/questions/route.js << 'EOF'
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 0;
    const category = searchParams.get('category');
    
    const client = await clientPromise;
    const db = client.db();
    
    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    
    // Get questions
    let questionsQuery = db.collection('questions').find(query);
    
    if (limit > 0) {
      questionsQuery = questionsQuery.limit(limit);
    }
    
    const questions = await questionsQuery.toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Public POST - Received question data:', body);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate required fields
    if (!body.question) {
      return NextResponse.json({ 
        error: 'Missing required field: question' 
      }, { status: 400 });
    }
    
    // Format the question properly
    const newQuestion = {
      question: body.question,
      options: body.options || [],
      correctAnswer: body.correctAnswer || '',
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('questions').insertOne(newQuestion);
    console.log('Public - Question saved with ID:', result.insertedId);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      question: newQuestion
    });
  } catch (error) {
    console.error('POST questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
