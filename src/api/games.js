import api from "./client";

const qs = (p) => new URLSearchParams(p).toString();

// ─── Games ────────────────────────────────────────────────────────────────────
export const listGames    = (p = {}) => api.get("/admin/games?" + qs(p));
export const createGame   = (body)   => api.post("/admin/games", body);
export const updateGame   = (id, b)  => api.put(`/admin/games/${id}`, b);
export const deleteGame   = (id)     => api.delete(`/admin/games/${id}`);
export const setGameStatus = (id, status) => api.patch(`/admin/games/${id}/status`, { status });

// Public game list (no auth)
export const publicGames  = (p = {}) => api.get("/games?" + qs(p));

// ─── Providers ────────────────────────────────────────────────────────────────
export const listProviders   = (p = {}) => api.get("/admin/providers?" + qs(p));
export const createProvider  = (body)   => api.post("/admin/providers", body);
export const updateProvider  = (id, b)  => api.put(`/admin/providers/${id}`, b);
export const deleteProvider  = (id)     => api.delete(`/admin/providers/${id}`);

// ─── Categories ───────────────────────────────────────────────────────────────
export const listCategories   = (p = {}) => api.get("/admin/categories?" + qs(p));
export const createCategory   = (body)   => api.post("/admin/categories", body);
export const updateCategory   = (id, b)  => api.put(`/admin/categories/${id}`, b);
export const deleteCategory   = (id)     => api.delete(`/admin/categories/${id}`);

// ─── Admin users ──────────────────────────────────────────────────────────────
export const adminListUsers  = (p = {}) => api.get("/admin/users?" + qs(p));
export const adminSetStatus  = (id, status) => api.patch(`/admin/users/${id}/status`, { status });

// ─── Master admins (via admin user list filtered by role) ─────────────────────
export const listAdmins   = (p = {}) => api.get("/admin/users?" + qs({ ...p, role: "ADMIN" }));
export const createAdmin  = (body)   => api.post("/users", { ...body, role: "ADMIN" });

// ─── Master activity (audit logs) ─────────────────────────────────────────────
export const masterAuditLogs = (p = {}) => api.get("/admin/audit-logs?" + qs(p));
