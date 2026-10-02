/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://gaming-shop-7jep.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;