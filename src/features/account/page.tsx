"use client";

import { useTV } from "@/shared/lib/hooks/useTV";
import AccountPageWeb from "./ui/AccountPageWeb";
import AccountPageTV from "./ui/AccountPageTV";

export default function AccountPage() {
  const isTV = useTV();
  return isTV ? <AccountPageTV /> : <AccountPageWeb />;
}
