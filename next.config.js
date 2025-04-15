/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Gerektiğinde buraya daha fazla domain ekleyebilirsiniz
    ],
  },
}

module.exports = nextConfig 