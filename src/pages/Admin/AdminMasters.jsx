import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { FaPlus, FaTimes } from "react-icons/fa";
import { listUsers, createUser, setStatus } from "../../api/users";

const PAGE_SIZE = 20;
const EMPTY = { firstName: "", lastName: "", username: "", email: "", phone: "", password: "" };

const AdminMasters = () => {
  const [masters, setMasters] = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    listUsers({ role: "MASTER", page, limit: PAGE_SIZE }).then(r => {
      if (r?.success) { setMasters(r.data.users); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (m) => {
    const next = m.status === "active" ? "blocked" : "active";
    const res = await setStatus(m._id, next);
    if (res?.success) load();
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.username || !form.email || !form.password)
      return setErr("First name, username, email and password are required.");
    setSaving(true); setErr("");
    const res = await createUser({ ...form, role: "MASTER" });
    setSaving(false);
    if (!res?.success) return setErr(res?.message || "Failed to create master.");
    setShowModal(false);
    setForm(EMPTY);
    load();
  };

  const filtered = masters.filter(m =>
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    `${m.firstName} ${m.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout pageTitle="Master Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Masters</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{masters.filter(m => m.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Blocked</p><h4 style={{ color: "#f87171" }}>{masters.filter(m => m.status === "blocked").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Masters</h3>
          <div className="p-search-bar">
            <input placeholder="Search master..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
            <button className="p-btn-add" onClick={() => { setShowModal(true); setErr(""); setForm(EMPTY); }}><FaPlus /> Add Master</button>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Email</th><th>Mobile</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={8} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={8} className="p-nodata">No masters found.</td></tr>
                    : filtered.map((m, i) => (
                      <tr key={m._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c084fc", fontWeight: 600 }}>{m.username}</td>
                        <td>{`${m.firstName} ${m.lastName || ""}`.trim()}</td>
                        <td style={{ fontSize: 11 }}>{m.email}</td>
                        <td>{m.phone || "—"}</td>
                        <td>{new Date(m.createdAt).toLocaleDateString("en-IN")}</td>
                        <td><span className={`p-badge ${m.status}`}>{m.status}</span></td>
                        <td>
                          <div className="p-action-btns">
                            {m.status === "active"
                              ? <button className="p-btn p-btn-block"   onClick={() => toggle(m)}>Block</button>
                              : <button className="p-btn p-btn-unblock" onClick={() => toggle(m)}>Unblock</button>
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

      {showModal && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>Add New Master</h3>
              <button className="p-modal-close" onClick={() => { setShowModal(false); setErr(""); }}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name",  key: "lastName" },
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
                <button className="p-btn p-btn-success" onClick={handleAdd} disabled={saving}>{saving ? "Creating…" : "Create Master"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMasters;
