export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  if (!filename) return new Response(JSON.stringify({ detail: "filename required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  const base = process.env.NEXT_PUBLIC_API_HOST_IP ?? "http://localhost:8084/new-api";
  const candidates = [
    `${base}/archive/dash/exists?filename=${encodeURIComponent(filename)}`,
    `${base}/archive/exists?filename=${encodeURIComponent(filename)}`,
    `${base.replace(":8084", ":8080")}/archive/dash/exists?filename=${encodeURIComponent(filename)}`,
    `${base.replace(":8084", ":8080")}/archive/exists?filename=${encodeURIComponent(filename)}`,
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
  return new Response(JSON.stringify({ detail: "No static resource archive/dash/exists.", instance: "/archive/dash/exists", status: 404, title: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
