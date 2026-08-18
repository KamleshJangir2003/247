import React, { useState, useEffect, useCallback } from "react";
import AgentLayout from "./AgentLayout";
import { agentTransactions } from "../../api/agent";

const PAGE_SIZE = 10;

const AgentUserActivity = () => {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    agentTransactions({ page, limit: PAGE_SIZE }).then(r => {
      if (r?.success) { setRows(r.data.transactions); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AgentLayout pageTitle="User Activity">
      <div className="p-card">
        <div className="p-card-header"><h3>Activity Logs (My Users)</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>User</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No activity found.</td></tr>
                    : rows.map((t, i) => (
                      <tr key={t._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{t.userId?.username || "—"}</td>
                        <td><span className="p-badge">{t.type}</span></td>
                        <td style={{ color: t.type?.includes("OUT") || t.type === "WITHDRAWAL" ? "#f87171" : "#4ade80", fontWeight: 600 }}>
                          ₹{t.amount?.toLocaleString("en-IN")}
                        </td>
                        <td>₹{t.balanceAfter?.toLocaleString("en-IN")}</td>
                        <td><span className={`p-badge ${t.status?.toLowerCase()}`}>{t.status}</span></td>
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

export default AgentUserActivity;
