import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  output: 'standalone',

  // Enhanced performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', '@heroicons/react', 'next-auth', 'react-hot-toast'],
    optimizeServerReact: true,
    webpackBuildWorker: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable aggressive optimization for better performance
  poweredByHeader: false,
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Enhanced chunk optimization for reduced critical path
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
            },
            nextAuth: {
              test: /[\\/]node_modules[\\/]next-auth[\\/]/,
              name: 'next-auth',
              priority: 20,
              chunks: 'all',
            },
            mongodb: {
              test: /[\\/]node_modules[\\/](mongodb|@auth\/mongodb-adapter)[\\/]/,
              name: 'mongodb',
              priority: 20,
              chunks: 'all',
            },
            cloudinary: {
              test: /[\\/]node_modules[\\/](cloudinary|next-cloudinary)[\\/]/,
              name: 'cloudinary',
              priority: 20,
              chunks: 'all',
            },
            // Group React components for better caching
            components: {
              test: /[\\/]components[\\/]/,
              name: 'components',
              priority: 15,
              chunks: 'all',
            },
          },
        },
        // Enable better tree shaking
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },
};

export default nextConfig;
