export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_API_HOST_IP ?? "http://localhost:8084/new-api";
  const candidates = [`${base}/ffmpeg/job/${id}`, `${base.replace(":8084", ":8080")}/ffmpeg/job/${id}`, `${base.replace("/new-api", "")}/ffmpeg/job/${id}`];
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
  return new Response(JSON.stringify({ detail: "No static resource ffmpeg/job.", instance: `/ffmpeg/job/${id}`, status: 404, title: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
