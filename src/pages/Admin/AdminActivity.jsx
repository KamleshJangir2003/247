import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { auditLogs } from "../../api/admin";

const PAGE_SIZE = 20;

const AdminActivity = () => {
  const [logs, setLogs]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    auditLogs({ page, limit: PAGE_SIZE }).then((res) => {
      if (res?.success) { setLogs(res.data.logs); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (l.actor?.username ?? "").toLowerCase().includes(q) ||
           l.action.toLowerCase().includes(q) ||
           l.target.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout pageTitle="Activity Logs">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Activity Logs</h3>
          <div className="p-search-bar">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Actor</th><th>Role</th><th>Action</th><th>Target</th><th>Date</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={6} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={6} className="p-nodata">No logs found.</td></tr>
                    : filtered.map((l, i) => (
                      <tr key={l._id ?? i}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{l.actor?.username ?? "—"}</td>
                        <td><span className={`p-badge ${(l.actor?.role ?? "").toLowerCase()}`}>{l.actor?.role ?? "—"}</span></td>
                        <td>{l.action}</td>
                        <td style={{ color: "#7a9ab8" }}>{l.target}</td>
                        <td style={{ color: "#4a6a8a", fontSize: 11 }}>{new Date(l.createdAt).toLocaleString("en-IN")}</td>
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
    </AdminLayout>
  );
};

export default AdminActivity;
