export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(request) {
  // Your existing leaderboard logic here
  return NextResponse.json({ leaderboard: [] });
}
