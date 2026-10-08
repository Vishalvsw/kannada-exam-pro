import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // ✅ Default limit is 100, hard cap at 500 — never returns unbounded results
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '100'),
      500
    );

    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");

    const results = await db.collection('quizresults')
      .find({})
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    console.log(`Quiz Results API: Returning ${results.length} results (limit=${limit})`);

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('GET quiz results error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");

    const quizResult = {
      userName: body.userName,
      userEmail: body.userEmail,
      instagramId: body.instagramId,
      score: body.score,
      totalQuestions: body.totalQuestions,
      percentage: body.percentage,
      correctCount: body.correctCount,
      wrongCount: body.wrongCount,
      timeFormatted: body.timeFormatted,
      date: new Date(),
      createdAt: new Date(),
    };

    const result = await db.collection('quizresults').insertOne(quizResult);
    console.log(`✅ Quiz saved for: ${body.userName} (${body.instagramId}) - Score: ${body.score}`);

    // Update user's score
    if (body.instagramId) {
      let user = await db.collection('users').findOne({ instagramId: body.instagramId });

      if (!user && body.userEmail) {
        user = await db.collection('users').findOne({ email: body.userEmail });
      }

      if (user) {
        const newTotalScore = (user.score || 0) + (body.score || 0);
        const newQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;

        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              score: newTotalScore,
              totalQuizzesTaken: newQuizzesTaken,
              lastQuizDate: new Date(),
              updatedAt: new Date(),
            },
          }
        );
        console.log(`✅ Updated user ${body.instagramId}: score=${newTotalScore}, quizzes=${newQuizzesTaken}`);
      } else {
        const newUser = {
          name: body.userName,
          instagramId: body.instagramId,
          email: body.userEmail,
          score: body.score,
          totalQuizzesTaken: 1,
          lastQuizDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.collection('users').insertOne(newUser);
        console.log(`✅ Created new user: ${body.instagramId} with score ${body.score}`);
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}