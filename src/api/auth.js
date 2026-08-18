import api from "./client";

export const register = (body) => api.post("/auth/register", body);
export const login    = (body) => api.post("/auth/login",    body);
export const logout   = ()     => api.post("/auth/logout",   {});
export const me       = ()     => api.get("/auth/me");
export const changePassword = (body) => api.post("/auth/change-password", body);
