"use client";

import { useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken, getUserId } from "@/shared/lib/auth";

export function useRequestContent() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(tmdbId: number) {
    if (status === "sending") return;

    const token = getToken();
    if (!token) {
      setStatus("error");
      return;
    }

    const userId = getUserId(token);
    if (!userId) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const trimmed = message.trim();
      const body: { userId: number; message: string; tmdbId: number } = {
        userId: Number(userId),
        message: trimmed || `Solicitud de contenido TMDB #${tmdbId}`,
        tmdbId,
      };

      const res = await fetch(`${API_HOST_IP}/suggested-content-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage("");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setMessage("");
  }

  return { message, setMessage, status, submit, reset };
}
