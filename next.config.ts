import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/categories",
        destination: "/category/all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

