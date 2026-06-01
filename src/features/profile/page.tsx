"use client";

import { useTV } from "@/shared/lib/hooks/useTV";
import ProfilePageWeb from "./ui/ProfilePageWeb";
import ProfilePageTV from "./ui/ProfilePageTV";

export default function ProfilePage({ id }: { id: string }) {
  const isTV = useTV();
  return isTV ? <ProfilePageTV id={id} /> : <ProfilePageWeb id={id} />;
}

