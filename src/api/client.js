const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const getAccessToken  = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setTokens = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const token = getRefreshToken();
  if (!token) throw new Error("No refresh token");
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
};

const request = async (path, options = {}, retry = true) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers });

    if (res.status === 401 && retry) {
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
        }
        const newToken = await refreshPromise;
        headers["Authorization"] = `Bearer ${newToken}`;
        const retried = await fetch(`${BASE}${path}`, { ...options, headers });
        return retried.json();
      } catch {
        clearTokens();
        window.location.href = "/login";
        return null;
      }
    }

    return res.json();
  } catch {
    return null;
  }
};

const api = {
  get:    (path, opts)  => request(path, { method: "GET",    ...opts }),
  post:   (path, body)  => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)  => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  (path, body)  => request(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: (path)        => request(path, { method: "DELETE" }),
  setTokens,
  clearTokens,
  getAccessToken,
};

export default api;
