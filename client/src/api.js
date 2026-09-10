const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function api(path, options = {}) {
  const r = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Request failed");
  return data;
}
export async function upload(file) {
  const body = new FormData();
  body.append("file", file);
  return api("/upload", { method: "POST", body });
}
