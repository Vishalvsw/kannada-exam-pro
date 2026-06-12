import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Default admin credentials
    const ADMIN_EMAIL = "admin@kannadaexampro.com";
    const ADMIN_PASSWORD = "Admin@123";
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        token: "admin-demo-token",
        user: { email, role: "admin" }
      });
    }
    
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
