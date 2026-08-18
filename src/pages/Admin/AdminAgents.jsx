import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { listUsers, setStatus } from "../../api/users";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listUsers({ role: "AGENT", limit: 100 }).then((res) => {
      if (res?.success) { setAgents(res.data.users); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (a) => {
    const next = a.status === "active" ? "blocked" : "active";
    const res = await setStatus(a._id, next);
    if (res?.success) load();
  };

  const filtered = agents.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    `${a.firstName} ${a.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Agents">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Agents</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{agents.filter(a => a.status === "active").length}</h4></div>
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
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Mobile</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No agents found.</td></tr>
                    : filtered.map((a, i) => (
                      <tr key={a._id}>
                        <td>{i + 1}</td>
                        <td style={{ color: "#2dd4bf", fontWeight: 600 }}>{a.username}</td>
                        <td>{`${a.firstName} ${a.lastName || ""}`.trim()}</td>
                        <td>{a.phone || "—"}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                        <td><span className={`p-badge ${a.status}`}>{a.status}</span></td>
                        <td>
                          <div className="p-action-btns">
                            {a.status === "active"
                              ? <button className="p-btn p-btn-block"   onClick={() => toggle(a)}>Block</button>
                              : <button className="p-btn p-btn-unblock" onClick={() => toggle(a)}>Unblock</button>
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
