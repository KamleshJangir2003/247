import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { getLogs } from "../../data/activityLog";

const PAGE_SIZE = 10;

const AdminActivity = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const logs = getLogs();
  const filtered = logs.filter(l => {
    const matchR = roleFilter === "all" || l.role === roleFilter;
    const matchQ = l.actor.toLowerCase().includes(search.toLowerCase()) ||
                   l.action.toLowerCase().includes(search.toLowerCase()) ||
                   l.target.toLowerCase().includes(search.toLowerCase());
    return matchR && matchQ;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout pageTitle="Activity Logs">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Activity Logs</h3>
          <div className="p-search-bar">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Actor</th><th>Role</th><th>Action</th><th>Target</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={7} className="p-nodata">No logs found.</td></tr>
                  : paginated.map((l, i) => (
                    <tr key={l.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{l.actor}</td>
                      <td><span className={`p-badge ${l.role}`}>{l.role}</span></td>
                      <td>{l.action}</td>
                      <td style={{ color: "#7a9ab8" }}>{l.target}</td>
                      <td style={{ color: "#4ade80" }}>{l.amount}</td>
                      <td style={{ color: "#4a6a8a", fontSize: 11 }}>{l.date}</td>
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
