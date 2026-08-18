import api from "./client";

// Wallet
export const getBalance = () => api.get("/wallet/balance");

// Deposits
export const createDeposit   = (body)        => api.post("/deposits", body);
export const listDeposits    = (params = {}) => api.get("/deposits?" + new URLSearchParams(params));
export const approveDeposit  = (id)          => api.post(`/deposits/${id}/approve`, {});
export const rejectDeposit   = (id, reason)  => api.post(`/deposits/${id}/reject`, { reason });

// Withdrawals
export const createWithdrawal  = (body)        => api.post("/withdrawals", body);
export const listWithdrawals   = (params = {}) => api.get("/withdrawals?" + new URLSearchParams(params));
export const approveWithdrawal = (id)          => api.post(`/withdrawals/${id}/approve`, {});
export const rejectWithdrawal  = (id, reason)  => api.post(`/withdrawals/${id}/reject`, { reason });

// Wallet Transactions
export const listTransactions = (params = {}) => api.get("/transactions?" + new URLSearchParams(params));

// Bonuses
export const listBonuses = (params = {}) => api.get("/bonuses?" + new URLSearchParams(params));
export const applyBonus  = (code, depositAmount = 0) => api.post("/bonuses/apply", { code, depositAmount });
