import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (email === 'admin@kannadaexampro.com' && password === 'Admin@123') {
      return NextResponse.json({
        success: true,
        token: 'demo-token-' + Date.now(),
        admin: {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'super_admin'
        }
      });
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
