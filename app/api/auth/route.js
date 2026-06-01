import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, user: body });
}

export async function GET() {
  return NextResponse.json({ status: 'Auth API is working' });
}
