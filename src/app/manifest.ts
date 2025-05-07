// Manifest Requirements
import type { MetadataRoute } from "next";
// Manifest Main Function
export default function manifest(): MetadataRoute.Manifest {
  // Returns Manifest JSON File
  return {
    name: "Miteve",
    short_name: "Miteve",
    description: `La forma más sencilla de tener tu propio "Netflix en casa"`,
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
