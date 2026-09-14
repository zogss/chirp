import type { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

const config: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  images: {
    remotePatterns: [
      // Clerk serves profile images from here
      { protocol: "https", hostname: "img.clerk.com" },
      // Legacy Clerk image host (older accounts)
      { protocol: "https", hostname: "images.clerk.dev" },
    ],
  },
};

export default config;
