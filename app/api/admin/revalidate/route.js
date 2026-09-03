import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request) {
  try {
    const { path, secret } = await request.json();
    
    // Security check
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin123';
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        message: `Revalidated ${path}`,
      });
    }
    
    // Revalidate all notes paths
    revalidatePath('/notes');
    revalidatePath('/api/notes');
    
    return NextResponse.json({
      success: true,
      message: 'Revalidated all notes paths',
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
