import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // ===== ADMIN CREDENTIALS =====
    const ADMIN_USERNAME = "admin@kannadaexam.com";
    const ADMIN_PASSWORD = "vsw@422";  // ← CHANGE THIS
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true,
        message: "Login successful",
        token: "admin-demo-token",
        user: { 
          username: ADMIN_USERNAME, 
          role: "admin",
          name: "Admin"
        }
      });
    }
    
    // Invalid credentials
    return NextResponse.json(
      { 
        success: false, 
        message: "Invalid username or password" 
      },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error. Please try again." 
      },
      { status: 500 }
    );
  }
}