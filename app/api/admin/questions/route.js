import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all questions
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questions = await db.collection("questions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Questions GET Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new question
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questionType = body.questionType || 'mcq';
    
    // Validation
    if (questionType === 'ordering') {
      if (!body.options || body.options.length !== 5) {
        return NextResponse.json(
          { error: 'Ordering questions must have exactly 5 options' },
          { status: 400 }
        );
      }
      if (!body.correctOrder) {
        return NextResponse.json(
          { error: 'Correct order is required for ordering questions' },
          { status: 400 }
        );
      }
      body.answer = null;
    } else {
      if (!body.options || body.options.length !== 4) {
        return NextResponse.json(
          { error: 'MCQ questions must have exactly 4 options' },
          { status: 400 }
        );
      }
      if (!body.answer) {
        return NextResponse.json(
          { error: 'Correct answer is required for MCQ questions' },
          { status: 400 }
        );
      }
      body.correctOrder = null;
    }
    
    const newQuestion = {
      question: body.question,
      questionType: questionType,
      options: body.options || [],
      answer: body.answer || null,
      correctOrder: body.correctOrder || null,
      explanation: body.explanation || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("questions").insertOne(newQuestion);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      message: 'Question added successfully'
    });
  } catch (error) {
    console.error('Admin Questions POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update question
export async function PUT(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questionId = body.id || body._id;
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(questionId)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const { id, _id, ...updateData } = body;
    const questionType = updateData.questionType || 'mcq';
    
    // Validation
    if (questionType === 'ordering') {
      if (!updateData.options || updateData.options.length !== 5) {
        return NextResponse.json(
          { error: 'Ordering questions must have exactly 5 options' },
          { status: 400 }
        );
      }
      if (!updateData.correctOrder) {
        return NextResponse.json(
          { error: 'Correct order is required for ordering questions' },
          { status: 400 }
        );
      }
      updateData.answer = null;
    } else {
      if (!updateData.options || updateData.options.length !== 4) {
        return NextResponse.json(
          { error: 'MCQ questions must have exactly 4 options' },
          { status: 400 }
        );
      }
      if (!updateData.answer) {
        return NextResponse.json(
          { error: 'Correct answer is required for MCQ questions' },
          { status: 400 }
        );
      }
      updateData.correctOrder = null;
    }
    
    const updateObject = {
      question: updateData.question,
      questionType: updateData.questionType || 'mcq',
      options: updateData.options || [],
      answer: updateData.answer || null,
      correctOrder: updateData.correctOrder || null,
      explanation: updateData.explanation || '',
      category: updateData.category || 'General',
      difficulty: updateData.difficulty || 'medium',
      updatedAt: new Date()
    };
    
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(questionId) },
      { $set: updateObject }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      modified: result.modifiedCount,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Admin Questions PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID format' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      deleted: result.deletedCount,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Admin Questions DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
