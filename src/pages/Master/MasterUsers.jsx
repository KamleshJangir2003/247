import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { masterUsers } from "../../api/agent";

const PAGE_SIZE = 20;

const MasterUsers = () => {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    masterUsers({ page, limit: PAGE_SIZE }).then(res => {
      if (res?.success) { setUsers(res.data.users); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.username.toLowerCase().includes(q) ||
                   `${u.firstName} ${u.lastName || ""}`.toLowerCase().includes(q) ||
                   (u.phone || "").includes(q);
    const matchF = filter === "all" || u.status === filter;
    return matchQ && matchF;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <MasterLayout pageTitle="User Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Users</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{users.filter(u => u.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Blocked</p><h4 style={{ color: "#f87171" }}>{users.filter(u => u.status === "blocked").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Users</h3>
          <div className="p-search-bar">
            <input placeholder="Search user..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 220 }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Mobile</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={6} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={6} className="p-nodata">No users found.</td></tr>
                    : filtered.map((u, i) => (
                      <tr key={u._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                        <td>{`${u.firstName} ${u.lastName || ""}`.trim()}</td>
                        <td>{u.phone || "—"}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                        <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
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

export default MasterUsers;
