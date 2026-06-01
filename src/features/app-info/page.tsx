"use client";

import { useTV } from "@/shared/lib/hooks/useTV";
import { AppInfoContent } from "@/features/app-info/ui/AppInfoContent";
import { AppInfoContentTV } from "@/features/app-info/ui/AppInfoContentTV";

export function AppInfoFeaturePage() {
  const isTV = useTV();
  return isTV ? <AppInfoContentTV /> : <AppInfoContent />;
}
