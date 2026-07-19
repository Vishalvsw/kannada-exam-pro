// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('kannada_exam_pro');
    
    const questions = await db.collection('questions').find({}).toArray();
    const notes = await db.collection('notes').find({}).toArray();
    const currentAffairs = await db.collection('current-affairs').find({}).toArray();
    
    const baseUrl = 'https://www.kannadaexampro.com';
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/quiz', priority: '0.9', changefreq: 'daily' },
      { url: '/notes', priority: '0.8', changefreq: 'weekly' },
      { url: '/current-affairs', priority: '0.8', changefreq: 'daily' },
      { url: '/leaderboard', priority: '0.7', changefreq: 'weekly' },
      { url: '/profile', priority: '0.6', changefreq: 'weekly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/contact', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.4', changefreq: 'monthly' },
      { url: '/terms', priority: '0.4', changefreq: 'monthly' },
      { url: '/disclaimer', priority: '0.3', changefreq: 'monthly' },
    ];
    
    const allPages = [...staticPages];
    
    questions.forEach((q) => {
      allPages.push({
        url: `/quiz/${q._id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: q.updatedAt || q.createdAt || new Date().toISOString()
      });
    });
    
    notes.forEach((note) => {
      allPages.push({
        url: `/notes/${note._id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: note.updatedAt || note.createdAt || new Date().toISOString()
      });
    });
    
    currentAffairs.forEach((ca) => {
      allPages.push({
        url: `/current-affairs/${ca._id}`,
        priority: '0.7',
        changefreq: 'daily',
        lastmod: ca.updatedAt || ca.createdAt || ca.date || new Date().toISOString()
      });
    });
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    allPages.forEach((page) => {
      const lastmod = page.lastmod ? new Date(page.lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error('Sitemap error:', error);
    const baseUrl = 'https://www.kannadaexampro.com';
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/quiz</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/current-affairs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    
    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
