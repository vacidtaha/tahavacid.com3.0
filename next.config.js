/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vzqhhmuttflqirejiupw.supabase.co', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'vzqhhmuttflqirejiupw.supabase.co',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src * data: https://fonts.gstatic.com; img-src 'self' data: blob: https://vzqhhmuttflqirejiupw.supabase.co; connect-src * wss:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
