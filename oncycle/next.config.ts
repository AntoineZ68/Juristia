import type { NextConfig } from "next";

// Export statique : le site est servi tel quel (Render Static Site, Netlify, Vercel…)
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
