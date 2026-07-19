import { NextResponse } from 'next/server';
export async function GET() {
  const robots = `# Allow all crawlers\nUser-agent: *\nAllow: /\n\n# Sitemap\nSitemap: https://www.kannadaexampro.com/sitemap.xml\n\n# Block sensitive areas\nUser-agent: *\nDisallow: /admin/\nDisallow: /api/\nDisallow: /admin-login/\nDisallow: /profile/\n\n# Crawl delays\nUser-agent: Googlebot\nCrawl-delay: 2\n\nUser-agent: bingbot\nCrawl-delay: 2\n\nUser-agent: Yahoo!\nCrawl-delay: 2\n`;
  return new NextResponse(robots, {
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' },
  });
}
