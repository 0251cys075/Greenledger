import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '*.trycloudflare.com',
    'read-doubt-relationships-familiar.trycloudflare.com',
  ],
};

export default nextConfig;
