export const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim()) ||
  "http://127.0.0.1:5000";

export async function apiFetch(
  path,
  { method = "GET", body, token, headers } = {}
) {
  const h = { "Content-Type": "application/json", ...(headers || {}) };
  if (token) h.Authorization = "Bearer " + token;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
