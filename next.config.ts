import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'localhost'], // Allow localhost for development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Explicitly set the output mode for Vercel deployment
  output: 'standalone',
  // Webpack configuration to handle Node.js module warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixing "Critical dependency: the request of a dependency is an expression" issue
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
