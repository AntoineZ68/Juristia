import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/mentions-legales`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/cgv`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/confidentialite`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
