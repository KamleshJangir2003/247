import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { listTransactions } from "../../api/wallet";

const PAGE_SIZE = 20;

const AdminTransactions = () => {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [typeFilter, setTypeFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: PAGE_SIZE };
    if (typeFilter !== "all")   params.type   = typeFilter.toUpperCase();
    if (statusFilter !== "all") params.status = statusFilter.toUpperCase();
    listTransactions(params).then((res) => {
      if (res?.success) { setRows(res.data.transactions); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page, typeFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (r.userId?.username ?? "").toLowerCase().includes(q) ||
           (r.reference ?? "").toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fmtType = (t) => {
    if (t === "DEPOSIT")    return { label: "⬇ Deposit",    color: "#4ade80" };
    if (t === "WITHDRAWAL") return { label: "⬆ Withdrawal", color: "#f87171" };
    return { label: t?.replace(/_/g, " ") ?? "—", color: "#c0d0e0" };
  };

  return (
    <AdminLayout pageTitle="All Transactions">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Records</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Showing</p><h4>{filtered.length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Transaction History</h3>
          <div className="p-search-bar">
            <input placeholder="Search user / reference" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="bonus">Bonus</option>
              <option value="transfer_in">Transfer In</option>
              <option value="transfer_out">Transfer Out</option>
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Type</th><th>User</th><th>Amount</th><th>Balance After</th><th>Reference</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={8} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={8} className="p-nodata">No records found.</td></tr>
                    : filtered.map((r, i) => {
                      const { label, color } = fmtType(r.type);
                      return (
                        <tr key={r._id}>
                          <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                          <td><span style={{ color, fontWeight: 600, fontSize: 12 }}>{label}</span></td>
                          <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{r.userId?.username ?? "—"}</td>
                          <td style={{ color, fontWeight: 600 }}>₹{r.amount?.toLocaleString("en-IN")}</td>
                          <td style={{ color: "#7a9ab8" }}>₹{r.balanceAfter?.toLocaleString("en-IN")}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.reference}</td>
                          <td>{new Date(r.createdAt).toLocaleString("en-IN")}</td>
                          <td><span className={`p-badge ${r.status?.toLowerCase()}`}>{r.status?.toLowerCase()}</span></td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="p-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
