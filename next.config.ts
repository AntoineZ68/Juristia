import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=true produit un dossier `out/` 100 % statique
 * (cible : Render Static Site, Cloudflare Pages, n'importe quel CDN).
 * Dans ce mode, les en-têtes ci-dessous ne sont PAS appliqués par Next :
 * ils sont repris dans `render.yaml`. Voir README.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
