import api from "./client";

const qs = (p) => new URLSearchParams(p).toString();

// ─── Games (Admin) ────────────────────────────────────────────────────────────
export const listGames    = (p = {}) => api.get("/admin/games?" + qs(p));
export const createGame   = (body)   => api.post("/admin/games", body);
export const updateGame   = (id, b)  => api.put(`/admin/games/${id}`, b);
export const deleteGame   = (id)     => api.delete(`/admin/games/${id}`);
export const setGameStatus = (id, status) => api.patch(`/admin/games/${id}/status`, { status });

// Public game list (no auth)
export const publicGames  = (p = {}) => api.get("/games?" + qs(p));

// ─── Providers (Admin) ────────────────────────────────────────────────────────
export const listProviders   = (p = {}) => api.get("/admin/providers?" + qs(p));
export const createProvider  = (body)   => api.post("/admin/providers", body);
export const updateProvider  = (id, b)  => api.put(`/admin/providers/${id}`, b);
export const deleteProvider  = (id)     => api.delete(`/admin/providers/${id}`);

// ─── Categories (Admin) ───────────────────────────────────────────────────────
export const listCategories   = (p = {}) => api.get("/admin/categories?" + qs(p));
export const createCategory   = (body)   => api.post("/admin/categories", body);
export const updateCategory   = (id, b)  => api.put(`/admin/categories/${id}`, b);
export const deleteCategory   = (id)     => api.delete(`/admin/categories/${id}`);

// ─── Games (Master) ───────────────────────────────────────────────────────────
export const masterListGames    = (p = {}) => api.get("/master/games?" + qs(p));
export const masterCreateGame   = (body)   => api.post("/master/games", body);
export const masterUpdateGame   = (id, b)  => api.put(`/master/games/${id}`, b);
export const masterDeleteGame   = (id)     => api.delete(`/master/games/${id}`);
export const masterSetGameStatus = (id, status) => api.patch(`/master/games/${id}/status`, { status });

// ─── Providers (Master) ───────────────────────────────────────────────────────
export const masterListProviders   = (p = {}) => api.get("/master/providers?" + qs(p));
export const masterCreateProvider  = (body)   => api.post("/master/providers", body);
export const masterUpdateProvider  = (id, b)  => api.put(`/master/providers/${id}`, b);
export const masterDeleteProvider  = (id)     => api.delete(`/master/providers/${id}`);

// ─── Categories (Master) ──────────────────────────────────────────────────────
export const masterListCategories   = (p = {}) => api.get("/master/categories?" + qs(p));
export const masterCreateCategory   = (body)   => api.post("/master/categories", body);
export const masterUpdateCategory   = (id, b)  => api.put(`/master/categories/${id}`, b);
export const masterDeleteCategory   = (id)     => api.delete(`/master/categories/${id}`);

// ─── Admin users ──────────────────────────────────────────────────────────────
export const adminListUsers  = (p = {}) => api.get("/admin/users?" + qs(p));
export const adminSetStatus  = (id, status) => api.patch(`/admin/users/${id}/status`, { status });

// ─── Master admins ────────────────────────────────────────────────────────────
export const listAdmins         = (p = {})        => api.get("/master/admins?" + qs(p));
export const createAdmin        = (body)           => api.post("/master/admins", body);
export const masterSetAdminStatus = (id, status)  => api.patch(`/master/admins/${id}/status`, { status });

// ─── Master activity (audit logs) ─────────────────────────────────────────────
export const masterAuditLogs = (p = {}) => api.get("/admin/audit-logs?" + qs(p));
