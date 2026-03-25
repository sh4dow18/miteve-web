// Manifest Requirements
import type { MetadataRoute } from "next";
// Manifest Main Function
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Miteve",
    short_name: "Miteve",
    description: "Miteve es una app web de Streaming para ver películas y series en un solo lugar y a través de internet",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
