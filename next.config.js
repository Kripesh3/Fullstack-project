/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.176.172.226', 'res.cloudinary.com', 'images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://192.176.172.226:8000/api',
  },
}

module.exports = nextConfig
