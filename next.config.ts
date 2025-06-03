import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', '@heroicons/react', 'next-auth', 'react-hot-toast'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
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
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
