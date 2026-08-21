import api from "./client";

export const listUsers  = (params = {}) => api.get("/users?" + new URLSearchParams(params));
export const createUser = (body)        => api.post("/users", body);
export const updateUser = (id, body)    => api.put(`/users/${id}`, body);
export const setStatus  = (id, status)  => api.patch(`/users/${id}/status`, { status });
