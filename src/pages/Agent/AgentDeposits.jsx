import React, { useState, useEffect, useCallback } from "react";
import AgentLayout from "./AgentLayout";
import { agentDeposits } from "../../api/agent";

const PAGE_SIZE = 20;
const STATUSES = ["", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const AgentDeposits = () => {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [status, setStatus]   = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const p = { page, limit: PAGE_SIZE };
    if (status) p.status = status;
    agentDeposits(p).then(r => {
      if (r?.success) { setRows(r.data.deposits); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AgentLayout pageTitle="Deposits">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Pending</p><h4 style={{ color: "#f59e0b" }}>{rows.filter(r => r.status === "PENDING").length}</h4></div>
        <div className="p-sum-card"><p>Approved</p><h4 style={{ color: "#4ade80" }}>{rows.filter(r => r.status === "APPROVED").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>User Deposits</h3>
          <div className="p-search-bar">
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s} value={s}>{s || "All Status"}</option>)}
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>User</th><th>Amount</th><th>Gateway</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={6} className="p-nodata">Loading…</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={6} className="p-nodata">No deposits found.</td></tr>
                    : rows.map((d, i) => (
                      <tr key={d._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0" }}>{d.userId?.username || "—"}</td>
                        <td style={{ color: "#4ade80", fontWeight: 600 }}>₹{d.amount.toLocaleString("en-IN")}</td>
                        <td>{d.gateway}</td>
                        <td><span className={`p-badge ${d.status.toLowerCase()}`}>{d.status}</span></td>
                        <td style={{ fontSize: 11, color: "#4a6a8a" }}>{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))
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
    </AgentLayout>
  );
};

export default AgentDeposits;
