import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  siteUrl:'https://tajrobat.github.io',
  sitemapSize: 10000,
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
