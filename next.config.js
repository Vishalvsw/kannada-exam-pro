/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      { source: '/ads.txt', headers: [{ key: 'Content-Type', value: 'text/plain' }] },
      { source: '/robots.txt', headers: [{ key: 'Content-Type', value: 'text/plain' }] },
    ];
  },
};

module.exports = nextConfig;
