// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // This is the primary hostname for Firebase Storage public URLs
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        // This is the hostname for Firebase Storage download URLs (the one in your error)
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For your placeholder content
      },
    ],
  },
};

export default nextConfig;