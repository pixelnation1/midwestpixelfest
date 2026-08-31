import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows local builds OOM when Next.js spawns ~11 static-generation
  // workers (ImageResponse OG/icons). Cap workers so `next build` completes.
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
