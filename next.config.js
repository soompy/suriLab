const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'image.thum.io',
      'pf-2024-magazine.vercel.app',
      'soompy.github.io',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.thum.io',
        port: '',
        pathname: '/get/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.github.io',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = withMDX(nextConfig)