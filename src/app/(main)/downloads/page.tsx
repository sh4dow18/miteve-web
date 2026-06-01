import { ROUTES_MAP } from "@/shared/config/routes";
import type { Metadata } from "next";
import DownloadsFeaturePage from "@/features/downloads/page";

export const metadata: Metadata = ROUTES_MAP.downloads.metadata;

export default function DownloadsPage() {
  return <DownloadsFeaturePage />;
}
