import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap", "radix-ui", "lucide-react"],
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    // Disable persistent FS cache until Next.js adds retention controls.
    // Prevents unbounded .next/dev/cache/turbopack bloat and 40s+ compaction hangs.
    turbopackFileSystemCacheForDev: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];
    const base = backendUrl.replace(/\/$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${base}/api/v1/:path*`,
      },
      {
        source: "/ready",
        destination: `${base}/ready`,
      },
      {
        source: "/health",
        destination: `${base}/health`,
      },
    ];
  },
};

export default nextConfig;
