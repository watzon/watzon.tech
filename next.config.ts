import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: undefined, // Let Vercel handle the optimal output
  trailingSlash: false,
  reactStrictMode: true,

  // SWC minification is enabled by default in Next.js 15
  // Removed problematic CSS optimization that requires critters
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;
