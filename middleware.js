import { NextResponse } from 'next/server';
export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  if (url.protocol === 'http:') { url.protocol = 'https:'; return NextResponse.redirect(url, 301); }
  if (host === 'kannadaexampro.com' || host === 'localhost:3000') { url.host = 'www.kannadaexampro.com'; return NextResponse.redirect(url, 301); }
  if (url.pathname !== '/' && url.pathname.endsWith('/')) { url.pathname = url.pathname.slice(0, -1); return NextResponse.redirect(url, 301); }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|logos).*)'] };
