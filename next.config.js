/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Ensure proper canonical URLs - set to false for better URL handling
  trailingSlash: false,
  
  // TEMPORARILY DISABLE REDIRECTS FOR TESTING
  // async redirects() {
  //   return [
  //     {
  //       source: '/login',
  //       destination: '/',
  //       permanent: false,
  //     },
  //     {
  //       source: '/admin',
  //       destination: '/admin-login',
  //       permanent: false,
  //     },
  //   ];
  // },
  
  // Headers for SEO and Security
  async headers() {
    return [
      // Sitemap headers
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/sitemap_index.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      // Robots.txt headers
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Security headers for all pages
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      // Login page - noindex
      {
        source: '/login',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Admin pages - noindex
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Admin login - noindex
      {
        source: '/admin-login',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // API routes - noindex
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'www.kannadaexampro.com', 'kannadaexampro.com'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.kannadaexampro.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Powered by header removal
  poweredByHeader: false,
};

module.exports = nextConfig;