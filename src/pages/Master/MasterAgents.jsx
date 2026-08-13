import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes } from "react-icons/fa";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, username: "agent777",  name: "Agent User",   email: "agent@777games.com",  mobile: "99887XXXXX", users: 45, created: "01 Feb 2024", status: "active"  },
  { id: 2, username: "agent002",  name: "South Agent",  email: "south@777games.com",  mobile: "77665XXXXX", users: 32, created: "10 Mar 2024", status: "active"  },
  { id: 3, username: "agent003",  name: "North Agent",  email: "north@777games.com",  mobile: "88990XXXXX", users: 18, created: "20 Apr 2024", status: "blocked" },
];

const MasterAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState(INIT);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", email: "", mobile: "", password: "" });
  const [err, setErr] = useState("");

  const filtered = agents.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    setAgents(agents.map(a => {
      if (a.id !== id) return a;
      const next = a.status === "active" ? "blocked" : "active";
      addLog(user.username, "master", `${next === "blocked" ? "Blocked" : "Unblocked"} agent`, a.username);
      return { ...a, status: next };
    }));
  };

  const handleAdd = () => {
    if (!form.username || !form.name || !form.password) return setErr("Username, name and password required.");
    if (agents.find(a => a.username === form.username)) return setErr("Username already exists.");
    const newAgent = { id: Date.now(), ...form, users: 0, created: new Date().toLocaleDateString("en-IN"), status: "active" };
    setAgents([...agents, newAgent]);
    addLog(user.username, "master", "Created agent", form.username);
    setShowModal(false);
    setForm({ username: "", name: "", email: "", mobile: "", password: "" });
    setErr("");
  };

  return (
    <MasterLayout pageTitle="Agent Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Agents</p><h4>{agents.length}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{agents.filter(a => a.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Blocked</p><h4 style={{ color: "#f87171" }}>{agents.filter(a => a.status === "blocked").length}</h4></div>
        <div className="p-sum-card"><p>Total Users</p><h4 style={{ color: "#4a9eff" }}>{agents.reduce((s, a) => s + a.users, 0)}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Agents</h3>
          <div className="p-search-bar">
            <input placeholder="Search agent..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
            <button className="p-btn-add" onClick={() => setShowModal(true)}><FaPlus /> Add Agent</button>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Email</th><th>Mobile</th><th>Users</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={9} className="p-nodata">No agents found.</td></tr>
                  : filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td style={{ color: "#2dd4bf", fontWeight: 600 }}>{a.username}</td>
                      <td>{a.name}</td>
                      <td style={{ fontSize: 11 }}>{a.email}</td>
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

      {showModal && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>Add New Agent</h3>
              <button className="p-modal-close" onClick={() => { setShowModal(false); setErr(""); }}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                {[
                  { label: "Username", key: "username" },
                  { label: "Full Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Mobile", key: "mobile" },
                  { label: "Password", key: "password", type: "password" },
                ].map(f => (
                  <div className="p-form-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.label} />
                  </div>
                ))}
              </div>
              {err && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{err}</p>}
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => { setShowModal(false); setErr(""); }}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleAdd}>Create Agent</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterAgents;
