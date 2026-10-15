import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep prerender tolerant on Netlify: Cache Components forbids new Date() at build. */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
