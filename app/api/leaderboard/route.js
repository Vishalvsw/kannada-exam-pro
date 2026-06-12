import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Try to get users from multiple possible collection names
    let users = [];
    const possibleCollections = ['users', 'User', 'Users', 'user'];
    
    for (const collectionName of possibleCollections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        if (count > 0) {
          users = await collection.find({}).sort({ score: -1 }).toArray();
          console.log(`Found ${users.length} users in collection: ${collectionName}`);
          break;
        }
      } catch (err) {
        console.log(`Collection ${collectionName} not found`);
      }
    }
    
    // If no users found in any collection, return empty array
    if (!users || users.length === 0) {
      console.log('No users collection found or empty');
      return NextResponse.json([]);
    }
    
    // Format users for leaderboard
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || user.fullName || 'Anonymous',
      instagramId: user.instagramId || user.email || 'user',
      score: user.score || user.totalScore || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || user.quizzesCount || 0,
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff`,
      createdAt: user.createdAt,
      lastQuizDate: user.lastQuizDate
    }));
    
    // Sort by score descending
    formattedUsers.sort((a, b) => b.score - a.score);
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([]);
  }
}
