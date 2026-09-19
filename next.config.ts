import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production builds go to a separate folder so `npm run dev` (which writes .next) cannot clobber a running `npm start`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
