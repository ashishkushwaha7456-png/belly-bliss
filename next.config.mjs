/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ride-chef-dev.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
