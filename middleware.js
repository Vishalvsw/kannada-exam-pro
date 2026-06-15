import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  
  // Add cache headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  }
  
  // Add compression headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
