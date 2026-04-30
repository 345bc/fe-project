/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@repo/ui"],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Dùng pattern wildcard cho nhiều subdomain
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default nextConfig; 