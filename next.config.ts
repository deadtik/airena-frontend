import { NextConfig } from 'next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',           },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // --- THIS IS THE FIX ---
      // Add this new object to allow images from Imgur
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

export default nextConfig;