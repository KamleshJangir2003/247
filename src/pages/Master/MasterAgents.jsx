import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes } from "react-icons/fa";
import { masterAgents, createMasterAgent, setAgentStatus, masterTransferToAgent, masterDebitAgent } from "../../api/agent";

const MasterAgents = () => {
  const [agents, setAgents]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showChips, setShowChips] = useState(null); // agent object
  const [chipsForm, setChipsForm] = useState({ amount: "", mode: "credit" });
  const [form, setForm]         = useState({ firstName: "", username: "", email: "", phone: "", password: "" });
  const [err, setErr]           = useState("");
  const [chipsErr, setChipsErr] = useState("");

  const PAGE_SIZE = 20;

  const load = useCallback(() => {
    setLoading(true);
    masterAgents({ page, limit: PAGE_SIZE }).then(res => {
      if (res?.success) { setAgents(res.data.agents); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (a) => {
    const next = a.status === "active" ? "blocked" : "active";
    const res = await setAgentStatus(a._id, next);
    if (res?.success) load();
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.username || !form.email || !form.password)
      return setErr("First name, username, email and password are required.");
    const res = await createMasterAgent(form);
    if (!res?.success) return setErr(res?.message || "Failed to create agent.");
    setShowModal(false);
    setForm({ firstName: "", username: "", email: "", phone: "", password: "" });
    setErr("");
    load();
  };

  const handleChips = async () => {
    const amount = Number(chipsForm.amount);
    if (!amount || amount <= 0) return setChipsErr("Enter a valid amount.");
    const fn = chipsForm.mode === "credit"
      ? masterTransferToAgent({ agentId: showChips._id, amount })
      : masterDebitAgent({ agentId: showChips._id, amount });
    const res = await fn;
    if (!res?.success) return setChipsErr(res?.message || "Operation failed.");
    setShowChips(null);
    setChipsForm({ amount: "", mode: "credit" });
    setChipsErr("");
    load();
  };

  const filtered = agents.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    `${a.firstName} ${a.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <MasterLayout pageTitle="Agent Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Agents</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{agents.filter(a => a.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Blocked</p><h4 style={{ color: "#f87171" }}>{agents.filter(a => a.status === "blocked").length}</h4></div>
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
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Email</th><th>Mobile</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={8} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={8} className="p-nodata">No agents found.</td></tr>
                    : filtered.map((a, i) => (
                      <tr key={a._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#2dd4bf", fontWeight: 600 }}>{a.username}</td>
                        <td>{`${a.firstName} ${a.lastName || ""}`.trim()}</td>
                        <td style={{ fontSize: 11 }}>{a.email}</td>
                        <td>{a.phone || "—"}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                        <td><span className={`p-badge ${a.status}`}>{a.status}</span></td>
                        <td>
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-primary" style={{ fontSize: 11 }} onClick={() => { setShowChips(a); setChipsErr(""); }}>Chips</button>
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

      {/* Add Agent Modal */}
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
                  { label: "First Name", key: "firstName" },
                  { label: "Username",   key: "username" },
                  { label: "Email",      key: "email" },
                  { label: "Mobile",     key: "phone" },
                  { label: "Password",   key: "password", type: "password" },
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

      {/* Chips Modal */}
      {showChips && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>Chips — {showChips.username}</h3>
              <button className="p-modal-close" onClick={() => setShowChips(null)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group">
                  <label>Mode</label>
                  <select value={chipsForm.mode} onChange={e => setChipsForm({ ...chipsForm, mode: e.target.value })}>
                    <option value="credit">Credit (Transfer to Agent)</option>
                    <option value="debit">Debit (Recover from Agent)</option>
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Amount</label>
                  <input type="number" min="1" value={chipsForm.amount} onChange={e => setChipsForm({ ...chipsForm, amount: e.target.value })} placeholder="Amount" />
                </div>
              </div>
              {chipsErr && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{chipsErr}</p>}
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setShowChips(null)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleChips}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterAgents;
