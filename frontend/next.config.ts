import type { NextConfig } from "next";

// next-pwa ships without type definitions, so it is loaded with require().
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // A service worker in development caches stale pages and gets in the way.
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A self-contained server bundle for the Docker image.
  output: "standalone",
};

export default withPWA(nextConfig);
