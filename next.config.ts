import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "standalone", 
  experimental: {
    optimizeCss: true, 
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Content-Type", value: "text/html; charset=UTF-8" },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    dangerouslyAllowSVG: true, // Ini buat allow SVG
    contentSecurityPolicy: "default-src 'self'; img-src * data: blob:;",
  },
};

export default nextConfig;


