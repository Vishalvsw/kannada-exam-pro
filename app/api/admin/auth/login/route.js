
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Add your admin auth logic here
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({ success: true, token: "dummy-token" });
    }
    
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
