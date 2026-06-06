import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all-time';
    
    let dateFilter = {};
    const now = new Date();
    
    switch(filter) {
      case 'today':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setHours(0, 0, 0, 0))
          }
        };
        break;
      case 'week':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setDate(now.getDate() - 7))
          }
        };
        break;
      case 'month':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setMonth(now.getMonth() - 1))
          }
        };
        break;
      default:
        dateFilter = {};
    }
    
    // First, aggregate scores from quiz-results to ensure accuracy
    const quizResultsAgg = await db.collection("quizresults")
      .aggregate([
        {
          $group: {
            _id: "$instagramId",
            totalScore: { $sum: "$score" },
            quizzesTaken: { $sum: 1 },
            lastQuizDate: { $max: "$completedAt" },
            avgPercentage: { $avg: "$percentage" }
          }
        }
      ])
      .toArray();
    
    // Create a map of aggregated scores
    const scoreMap = new Map();
    quizResultsAgg.forEach(result => {
      scoreMap.set(result._id, {
        totalScore: result.totalScore,
        quizzesTaken: result.quizzesTaken,
        lastQuizDate: result.lastQuizDate,
        avgPercentage: result.avgPercentage
      });
    });
    
    // Get users from users collection
    const users = await db.collection("users")
      .find(dateFilter)
      .toArray();
    
    // Merge data: use quiz-results for scores, users for profile info
    const mergedUsers = users.map(user => {
      const quizData = scoreMap.get(user.instagramId) || {};
      return {
        _id: user._id,
        name: user.name || 'Anonymous',
        instagramId: user.instagramId || 'user',
        email: user.email,
        score: quizData.totalScore || user.score || 0,
        totalQuizzesTaken: quizData.quizzesTaken || user.totalQuizzesTaken || 0,
        lastQuizDate: quizData.lastQuizDate || user.lastQuizDate,
        avgPercentage: quizData.avgPercentage || 0
      };
    });
    
    // Also include users who have quiz results but aren't in users collection
    for (const [instagramId, data] of scoreMap) {
      if (!mergedUsers.find(u => u.instagramId === instagramId)) {
        mergedUsers.push({
          instagramId: instagramId,
          name: instagramId,
          score: data.totalScore,
          totalQuizzesTaken: data.quizzesTaken,
          lastQuizDate: data.lastQuizDate,
          avgPercentage: data.avgPercentage
        });
      }
    }
    
    // Sort by score descending and limit to 100
    const sortedUsers = mergedUsers
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
    
    return NextResponse.json(sortedUsers);
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}