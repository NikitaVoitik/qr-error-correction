import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets Tailwind process the CSS files
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
