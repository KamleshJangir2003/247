import api from "./client";

export const dashboard  = ()             => api.get("/admin/dashboard");
export const auditLogs  = (params = {})  => api.get("/admin/audit-logs?" + new URLSearchParams(params));
