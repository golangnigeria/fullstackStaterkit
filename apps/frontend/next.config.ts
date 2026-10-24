import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tutorlinkng/openapi", "@tutorlinkng/zod"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
