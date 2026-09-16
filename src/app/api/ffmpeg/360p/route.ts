export async function POST(request: Request) {
  const body = await request.text();
  const urlObj = new URL(request.url);
  const asyncParam = urlObj.searchParams.get("async");
  const qs = asyncParam ? `?async=${asyncParam}` : "";
  const base = process.env.NEXT_PUBLIC_API_HOST_IP ?? "http://localhost:8084/new-api";
  const candidates = [`${base}/ffmpeg/360p${qs}`, `${base.replace(":8084", ":8080")}/ffmpeg/360p${qs}`, `${base.replace("/new-api", "")}/ffmpeg/360p${qs}`];
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const auth = request.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "POST", headers, body });
      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
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
  return new Response(JSON.stringify({ detail: "No static resource ffmpeg/360p.", instance: "/ffmpeg/360p", status: 404, title: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
