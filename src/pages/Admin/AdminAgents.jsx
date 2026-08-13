import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, username: "agent777",  name: "Agent User",  email: "agent@777games.com",  mobile: "99887XXXXX", users: 45, created: "01 Feb 2024", status: "active"  },
  { id: 2, username: "agent002",  name: "South Agent", email: "south@777games.com",  mobile: "77665XXXXX", users: 32, created: "10 Mar 2024", status: "active"  },
  { id: 3, username: "agent003",  name: "North Agent", email: "north@777games.com",  mobile: "88990XXXXX", users: 18, created: "20 Apr 2024", status: "blocked" },
];

const AdminAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState(INIT);
  const [search, setSearch] = useState("");

  const toggle = (id) => {
    setAgents(agents.map(a => {
      if (a.id !== id) return a;
      const next = a.status === "active" ? "blocked" : "active";
      addLog(user.username, "admin", `${next === "blocked" ? "Blocked" : "Unblocked"} agent`, a.username);
      return { ...a, status: next };
    }));
  };

  const filtered = agents.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Agents">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Agents</p><h4>{agents.length}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{agents.filter(a => a.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Total Users</p><h4 style={{ color: "#4a9eff" }}>{agents.reduce((s, a) => s + a.users, 0)}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Agents</h3>
          <div className="p-search-bar">
            <input placeholder="Search agent..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Mobile</th><th>Users</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8} className="p-nodata">No agents found.</td></tr>
                  : filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td style={{ color: "#2dd4bf", fontWeight: 600 }}>{a.username}</td>
                      <td>{a.name}</td>
                      <td>{a.mobile}</td>
                      <td style={{ color: "#4a9eff", fontWeight: 600 }}>{a.users}</td>
                      <td>{a.created}</td>
                      <td><span className={`p-badge ${a.status}`}>{a.status}</span></td>
                      <td>
                        <div className="p-action-btns">
                          {a.status === "active"
                            ? <button className="p-btn p-btn-block" onClick={() => toggle(a.id)}>Block</button>
                            : <button className="p-btn p-btn-unblock" onClick={() => toggle(a.id)}>Unblock</button>
                          }
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAgents;
