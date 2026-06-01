"use client";

import { useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken, getUserId } from "@/shared/lib/auth";

export function useSuggestContent() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit() {
    const trimmed = message.trim();
    if (!trimmed || status === "sending") return;

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
      const res = await fetch(`${API_HOST_IP}/suggested-content-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: Number(userId), message: trimmed }),
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
  }

  return { message, setMessage, status, submit, reset };
}
