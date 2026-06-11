
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Add your admin login logic here
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({ success: true, message: "Login successful" });
    }
    
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
