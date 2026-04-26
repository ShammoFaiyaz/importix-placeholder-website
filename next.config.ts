import type { NextConfig } from "next";

/** Set once per `next build` / dev server start — countdown ends 30 days after that moment (e.g. Vercel deploy). */
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COUNTDOWN_END_MS: String(Date.now() + THIRTY_DAYS_MS),
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
