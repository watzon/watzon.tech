import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: undefined, // Let Vercel handle the optimal output
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,

  // Ensure proper handling of static assets and API routes
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
