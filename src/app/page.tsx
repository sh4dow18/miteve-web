"use client";
import { useLandingRedirect } from "@/features/landing/model/useLandingRedirect";

export default function Home() {
  useLandingRedirect();
  return null;
}
