import type { MetadataRoute } from "next";
import { ROUTES_LIST, routeToHref } from "@/shared/config/routes";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES_LIST.filter((route) => route.inSitemap).map((route) => ({
    url: `${BASE_URL}${routeToHref(route.path)}`,
    changeFrequency: "weekly",
    priority: route.path === "" || route.path === "home" ? 1 : 0.8,
  }));
}
