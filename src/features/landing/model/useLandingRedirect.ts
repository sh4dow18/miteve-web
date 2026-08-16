import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken, getUserId } from "@/shared/lib/auth";

export function useLandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/home");
      return;
    }

    const userId = getUserId(token);
    if (!userId) {
      router.replace("/home");
      return;
    }

    fetch(`${API_HOST_IP}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) return router.replace("/home");
        const data = (await res.json()) as { profilesList?: unknown[] };
        const count = data.profilesList?.length ?? 0;
        if (count > 1) {
          router.replace("/profile/switch");
        } else {
          router.replace("/home");
        }
      })
      .catch(() => {
        router.replace("/home");
      });
  }, [router]);
}
