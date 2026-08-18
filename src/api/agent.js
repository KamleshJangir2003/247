import api from "./client";

// ─── Master ───────────────────────────────────────────────────────────────────
export const masterDashboard       = ()           => api.get("/master/dashboard");
export const masterAgents          = (p = {})     => api.get("/master/agents?" + new URLSearchParams(p));
export const createMasterAgent     = (body)       => api.post("/master/agents", body);
export const setAgentStatus        = (id, status) => api.patch(`/master/agents/${id}/status`, { status });
export const masterUsers           = (p = {})     => api.get("/master/users?" + new URLSearchParams(p));
export const masterTransferToAgent = (body)       => api.post("/master/transfer-agent", body);
export const masterDebitAgent      = (body)       => api.post("/master/debit-agent", body);
export const masterDeposits        = (p = {})     => api.get("/master/deposits?" + new URLSearchParams(p));
export const masterWithdrawals     = (p = {})     => api.get("/master/withdrawals?" + new URLSearchParams(p));
export const masterTransactions    = (p = {})     => api.get("/master/transactions?" + new URLSearchParams(p));
export const masterCommissions     = (p = {})     => api.get("/master/commissions?" + new URLSearchParams(p));
export const masterReport          = ()           => api.get("/master/report");

// ─── Agent ────────────────────────────────────────────────────────────────────
export const agentDashboard      = ()           => api.get("/agent/dashboard");
export const myUsers             = (p = {})     => api.get("/agent/users?" + new URLSearchParams(p));
export const createAgentUser     = (body)       => api.post("/agent/users", body);
export const setUserStatus       = (id, status) => api.patch(`/agent/users/${id}/status`, { status });
export const agentTransferToUser = (body)       => api.post("/agent/transfer-user", body);
export const agentDebitUser      = (body)       => api.post("/agent/debit-user", body);
export const agentDeposits       = (p = {})     => api.get("/agent/deposits?" + new URLSearchParams(p));
export const agentWithdrawals    = (p = {})     => api.get("/agent/withdrawals?" + new URLSearchParams(p));
export const agentTransactions   = (p = {})     => api.get("/agent/transactions?" + new URLSearchParams(p));
export const agentCommissions    = (p = {})     => api.get("/agent/commissions?" + new URLSearchParams(p));
export const agentReport         = ()           => api.get("/agent/report");
