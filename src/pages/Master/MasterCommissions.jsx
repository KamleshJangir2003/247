import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { masterCommissions } from "../../api/agent";

const PAGE_SIZE = 20;

const MasterCommissions = () => {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    masterCommissions({ page, limit: PAGE_SIZE }).then(r => {
      if (r?.success) { setRows(r.data.commissions); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const totalAmt   = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <MasterLayout pageTitle="Commissions">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Records</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Page Total</p><h4 style={{ color: "#4ade80" }}>₹{totalAmt.toLocaleString("en-IN")}</h4></div>
        <div className="p-sum-card"><p>Pending</p><h4 style={{ color: "#f59e0b" }}>{rows.filter(r => r.status === "PENDING").length}</h4></div>
        <div className="p-sum-card"><p>Paid</p><h4 style={{ color: "#4ade80" }}>{rows.filter(r => r.status === "PAID").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header"><h3>My Commissions</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Source User</th><th>Agent</th><th>Amount</th><th>Rate %</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No commissions found.</td></tr>
                    : rows.map((c, i) => (
                      <tr key={c._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0" }}>{c.sourceUser?.username || "—"}</td>
                        <td style={{ color: "#2dd4bf" }}>{c.agent?.username || "—"}</td>
                        <td style={{ color: "#4ade80", fontWeight: 600 }}>₹{c.amount.toLocaleString("en-IN")}</td>
                        <td>{c.percentage}%</td>
                        <td><span className={`p-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                        <td style={{ fontSize: 11, color: "#4a6a8a" }}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
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
    </MasterLayout>
  );
};

export default MasterCommissions;
