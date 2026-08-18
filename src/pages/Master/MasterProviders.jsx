import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { listProviders, createProvider, updateProvider, deleteProvider } from "../../api/games";

const CATEGORIES = ["Live Casino", "Slot", "Crash", "Sports", "Fantasy", "Lottery", "Exchange", "general"];
const EMPTY = { name: "", category: "general", description: "" };

const MasterProviders = () => {
  const [providers, setProviders] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [err, setErr]             = useState("");
  const [saving, setSaving]       = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    listProviders({ limit: 100 }).then(r => {
      if (r?.success) { setProviders(r.data.providers); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return setErr("Provider name is required.");
    setSaving(true); setErr("");
    const res = modal === "add"
      ? await createProvider(form)
      : await updateProvider(modal._id, form);
    setSaving(false);
    if (!res?.success) return setErr(res?.message || "Save failed.");
    setModal(null); load();
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete provider "${p.name}"?`)) return;
    const res = await deleteProvider(p._id);
    if (res?.success) load();
  };

  return (
    <MasterLayout pageTitle="Providers">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Providers</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{providers.filter(p => p.status === "active").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Providers</h3>
          <button className="p-btn-add" onClick={() => { setForm(EMPTY); setErr(""); setModal("add"); }}><FaPlus /> Add Provider</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Provider</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={5} className="p-nodata">Loading…</td></tr>
                  : providers.length === 0
                    ? <tr><td colSpan={5} className="p-nodata">No providers found.</td></tr>
                    : providers.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{p.name}</td>
                        <td><span className="p-badge user">{p.category}</span></td>
                        <td><span className={`p-badge ${p.status}`}>{p.status}</span></td>
                        <td>
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-edit" onClick={() => { setForm({ name: p.name, category: p.category, description: p.description }); setErr(""); setModal(p); }}><FaEdit /></button>
                            <button className="p-btn p-btn-delete" onClick={() => handleDelete(p)}><FaTrash /></button>
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

      {modal !== null && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>{modal === "add" ? "Add Provider" : `Edit: ${modal.name}`}</h3>
              <button className="p-modal-close" onClick={() => setModal(null)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Provider Name *</label><input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Provider name" /></div>
                <div className="p-form-group">
                  <label>Category</label>
                  <select value={form.category || "general"} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="p-form-group full"><label>Description</label><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional" /></div>
              </div>
              {err && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{err}</p>}
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setModal(null)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterProviders;
