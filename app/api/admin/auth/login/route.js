import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt:', { email, password: '***' });
    
    // Default admin credentials (email based)
    const ADMIN_EMAIL = "admin@kannadaexampro.com";
    const ADMIN_PASSWORD = "Admin@123";
    
    // Check against hardcoded admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        token: "admin-demo-token-123",
        admin: { 
          email: ADMIN_EMAIL, 
          name: "Admin",
          role: "super_admin"
        }
      });
    }
    
    // Also check database if you have admin collection
    try {
      const client = await clientPromise;
      const db = client.db();
      const admin = await db.collection('admins').findOne({ email, password });
      
      if (admin) {
        return NextResponse.json({ 
          success: true, 
          message: "Login successful",
          token: "admin-token-" + Date.now(),
          admin: admin
        });
      }
    } catch (dbError) {
      console.log('DB check skipped or failed');
    }
    
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
