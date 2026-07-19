const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://kannadaexampro:Vishal422@cluster0.ssqzwoz.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('kannada_exam_pro');
    
    const questions = await db.collection('questions').find({}).toArray();
    const notes = await db.collection('notes').find({}).toArray();
    const currentAffairs = await db.collection('current-affairs').find({}).toArray();
    
    const baseUrl = 'https://www.kannadaexampro.com';
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const staticPages = [
      '/', '/quiz', '/notes', '/current-affairs', '/leaderboard',
      '/profile', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'
    ];
    
    staticPages.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `    <priority>${url === '/' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    questions.forEach(q => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/quiz/${q._id}</loc>\n`;
      xml += `    <lastmod>${new Date(q.updatedAt || q.createdAt || Date.now()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
    
    notes.forEach(note => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/notes/${note._id}</loc>\n`;
      xml += `    <lastmod>${new Date(note.updatedAt || note.createdAt || Date.now()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });
    
    currentAffairs.forEach(ca => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/current-affairs/${ca._id}</loc>\n`;
      xml += `    <lastmod>${new Date(ca.updatedAt || ca.createdAt || ca.date || Date.now()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += '</urlset>';
    
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
    console.log('✅ Sitemap generated successfully!');
    
    await client.close();
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
