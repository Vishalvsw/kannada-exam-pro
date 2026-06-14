import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  
  // Add compression headers
  response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
