export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");
  const tmdbId = searchParams.get("tmdbId");
  if (!slug || !type) return new Response(JSON.stringify({ detail: "slug and type required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  const qs = tmdbId ? `?slug=${encodeURIComponent(slug)}&type=${encodeURIComponent(type)}&tmdbId=${encodeURIComponent(tmdbId)}` : `?slug=${encodeURIComponent(slug)}&type=${encodeURIComponent(type)}`;
  const base = process.env.NEXT_PUBLIC_API_HOST_IP ?? "http://localhost:8084/new-api";
  const candidates = [
    `${base}/upload/verify-dash${qs}`,
    `${base.replace(":8084", ":8080")}/upload/verify-dash${qs}`,
    `${base.replace("/new-api", "")}/upload/verify-dash${qs}`,
  ];
  const headers: Record<string, string> = {};
  const auth = request.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers });
      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text };
      }
      if (res.ok) return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
      const detail = (data as { detail?: string })?.detail ?? "";
      if (detail.includes("No static resource")) continue;
      if (res.status === 404) continue;
      return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
    } catch {
      continue;
    }
  }
  return new Response(JSON.stringify({ detail: "No static resource upload/verify-dash.", instance: "/upload/verify-dash", status: 404, title: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
