import React, { useState, useEffect, useCallback } from "react";
import AgentLayout from "./AgentLayout";
import { agentTransactions } from "../../api/agent";

const PAGE_SIZE = 20;
const TYPES = ["", "DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT", "COMMISSION", "BONUS", "REFUND", "ADJUSTMENT"];

const AgentTransactions = () => {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [type, setType]       = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const p = { page, limit: PAGE_SIZE };
    if (type) p.type = type;
    agentTransactions(p).then(r => {
      if (r?.success) { setRows(r.data.transactions); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page, type]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AgentLayout pageTitle="Transactions">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Transactions</h3>
          <div className="p-search-bar">
            <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
              {TYPES.map(t => <option key={t} value={t}>{t || "All Types"}</option>)}
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>User</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No transactions found.</td></tr>
                    : rows.map((t, i) => (
                      <tr key={t._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0" }}>{t.userId?.username || "—"}</td>
                        <td><span className="p-badge">{t.type}</span></td>
                        <td style={{ color: t.type.includes("OUT") || t.type === "WITHDRAWAL" ? "#f87171" : "#4ade80", fontWeight: 600 }}>
                          ₹{t.amount.toLocaleString("en-IN")}
                        </td>
                        <td>₹{t.balanceAfter.toLocaleString("en-IN")}</td>
                        <td><span className={`p-badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                        <td style={{ fontSize: 11, color: "#4a6a8a" }}>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
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

export default AgentTransactions;
