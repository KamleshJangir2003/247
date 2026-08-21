import api from "./client";

const qs = (p) => new URLSearchParams(p).toString();

// ─── Games (SUPER_ADMIN only) ─────────────────────────────────────────────────
export const listGames     = (p = {})        => api.get("/admin/games?" + qs(p));
export const createGame    = (body)          => api.post("/admin/games", body);
export const updateGame    = (id, b)         => api.put(`/admin/games/${id}`, b);
export const deleteGame    = (id)            => api.delete(`/admin/games/${id}`);
export const setGameStatus = (id, status)    => api.patch(`/admin/games/${id}/status`, { status });

// Public game list (no auth)
export const publicGames   = (p = {})        => api.get("/games?" + qs(p));

// ─── Providers (SUPER_ADMIN only) ─────────────────────────────────────────────
export const listProviders   = (p = {})      => api.get("/admin/providers?" + qs(p));
export const createProvider  = (body)        => api.post("/admin/providers", body);
export const updateProvider  = (id, b)       => api.put(`/admin/providers/${id}`, b);
export const deleteProvider  = (id)          => api.delete(`/admin/providers/${id}`);

// ─── Categories (SUPER_ADMIN only) ────────────────────────────────────────────
export const listCategories   = (p = {})     => api.get("/admin/categories?" + qs(p));
export const createCategory   = (body)       => api.post("/admin/categories", body);
export const updateCategory   = (id, b)      => api.put(`/admin/categories/${id}`, b);
export const deleteCategory   = (id)         => api.delete(`/admin/categories/${id}`);

// ─── Users (SUPER_ADMIN only) ─────────────────────────────────────────────────
export const adminListUsers = (p = {})       => api.get("/admin/users?" + qs(p));
export const adminSetStatus = (id, status)   => api.patch(`/admin/users/${id}/status`, { status });

// ─── Master activity (audit logs — scoped to master subtree via backend) ──────
export const masterAuditLogs = (p = {})      => api.get("/master/activity?" + qs(p));
