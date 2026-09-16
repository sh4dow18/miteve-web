export async function POST(request: Request) {
  const body = await request.text();
  const base = process.env.NEXT_PUBLIC_API_HOST_IP ?? "http://localhost:8084/new-api";
  const candidates = [
    `${base}/upload/mkdir`,
    `${base}/upload/folder`,
    `${base.replace(":8084", ":8080")}/upload/mkdir`,
    `${base.replace(":8084", ":8080")}/upload/folder`,
    `${base.replace("/new-api", "")}/upload/mkdir`,
  ];
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
  return new Response(JSON.stringify({ detail: "No static resource upload/mkdir.", instance: "/upload/mkdir", status: 404, title: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
