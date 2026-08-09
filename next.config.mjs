/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    optimizeCss: {
      inlineFonts: true,
      preload: 'media',
      pruneSource: false,
    },
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core', 'pdf-parse', 'mammoth'],
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-hot-toast'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'joinsophi.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/chat',
        destination: '/new-cv',
        permanent: true,
      },
      {
        source: '/upload',
        destination: '/transform-cv',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.joinsophi.com' }],
        destination: 'https://joinsophi.com/:path*',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
