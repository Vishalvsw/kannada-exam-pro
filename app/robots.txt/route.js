// app/robots.txt/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://www.kannadaexampro.com/sitemap.xml

# Block admin pages
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /admin-login/
Disallow: /profile/

# Crawl delay for Google
User-agent: Googlebot
Crawl-delay: 2

# Crawl delay for Bing
User-agent: bingbot
Crawl-delay: 2
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
