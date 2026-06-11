/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Changed from 'export' - this enables API routes
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
}

module.exports = nextConfig
