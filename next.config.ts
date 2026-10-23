import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production builds go to a separate folder so `npm run dev` (which writes .next) cannot clobber a running `npm start`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    // 750/828/1080 match 2x–3x phone screens (375–414pt), so phones stop fetching the next size up (e.g. 1024 for 780)
    deviceSizes: [390, 640, 750, 828, 1080, 1280, 1440, 1920],
    // 60 for background photos under a dark overlay, 75 (the default) for everything else
    qualities: [60, 75],
    // uploads get unique file names, so optimized copies can be cached for 30 days instead of 60 seconds
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
