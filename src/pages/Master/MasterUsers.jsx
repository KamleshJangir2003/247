import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { INIT_USERS } from "../../data/usersData";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 5;

const MasterUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const toggle = (id) => {
    setUsers(users.map(u => {
      if (u.id !== id) return u;
      const next = u.status === "active" ? "blocked" : "active";
      addLog(user.username, "master", `${next === "blocked" ? "Blocked" : "Unblocked"} user`, u.username);
      return { ...u, status: next };
    }));
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.mobile.includes(q);
    const matchF = filter === "all" || u.status === filter;
    return matchQ && matchF;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <MasterLayout pageTitle="User Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Users</p><h4>{users.length}</h4></div>
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
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Mobile</th><th>Balance</th><th>Agent</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={9} className="p-nodata">No users found.</td></tr>
                  : paginated.map((u, i) => (
                    <tr key={u.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                      <td>{u.name}</td>
                      <td>{u.mobile}</td>
                      <td style={{ color: "#4ade80", fontWeight: 600 }}>₹{u.balance.toLocaleString("en-IN")}</td>
                      <td style={{ color: "#2dd4bf", fontSize: 11 }}>{u.agent}</td>
                      <td>{u.joined}</td>
                      <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
                      <td>
                        <div className="p-action-btns">
                          {u.status === "active"
                            ? <button className="p-btn p-btn-block" onClick={() => toggle(u.id)}>Block</button>
                            : <button className="p-btn p-btn-unblock" onClick={() => toggle(u.id)}>Unblock</button>
                          }
                        </div>
                      </td>
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
