// Sitemap Requirements
import type { MetadataRoute } from "next";
// Sitemap Main Function
export default function sitemap(): MetadataRoute.Sitemap {
  // Returns Sitemap XML File
  return [
    {
      url: "https://miteve.vercel.app",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://miteve.vercel.app/how-it-works",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://miteve.vercel.app/movies",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://miteve.vercel.app/series",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}