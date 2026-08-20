import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { masterListCategories, masterCreateCategory, masterUpdateCategory, masterDeleteCategory } from "../../api/games";

const EMPTY = { name: "", icon: "", sortOrder: "" };

const MasterCategories = () => {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [err, setErr]         = useState("");
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    masterListCategories().then(r => {
      if (r?.success) setCats(r.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return setErr("Category name is required.");
    setSaving(true); setErr("");
    const payload = { name: form.name, icon: form.icon || "", sortOrder: Number(form.sortOrder) || 0 };
    const res = modal === "add"
      ? await masterCreateCategory(payload)
      : await masterUpdateCategory(modal._id, payload);
    setSaving(false);
    if (!res?.success) return setErr(res?.message || "Save failed.");
    setModal(null); load();
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    const res = await masterDeleteCategory(c._id);
    if (res?.success) load();
  };

  const handleToggle = async (c) => {
    const next = c.status === "active" ? "inactive" : "active";
    const res = await masterUpdateCategory(c._id, { status: next });
    if (res?.success) load();
  };

  return (
    <MasterLayout pageTitle="Categories">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Categories</h3>
          <button className="p-btn-add" onClick={() => { setForm(EMPTY); setErr(""); setModal("add"); }}><FaPlus /> Add Category</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Icon</th><th>Name</th><th>Order</th><th>Status</th><th>Toggle</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : cats.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No categories found.</td></tr>
                    : cats.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td style={{ fontSize: 20 }}>{c.icon || "—"}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{c.name}</td>
                        <td>{c.sortOrder}</td>
                        <td><span className={`p-badge ${c.status}`}>{c.status}</span></td>
                        <td>
                          <label className="p-toggle">
                            <input type="checkbox" checked={c.status === "active"} onChange={() => handleToggle(c)} />
                            <span className="p-toggle-slider" />
                          </label>
                        </td>
                        <td>
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-edit" onClick={() => { setForm({ name: c.name, icon: c.icon, sortOrder: c.sortOrder }); setErr(""); setModal(c); }}><FaEdit /></button>
                            <button className="p-btn p-btn-delete" onClick={() => handleDelete(c)}><FaTrash /></button>
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
              <h3>{modal === "add" ? "Add Category" : `Edit: ${modal.name}`}</h3>
              <button className="p-modal-close" onClick={() => setModal(null)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" /></div>
                <div className="p-form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🎰" /></div>
                <div className="p-form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} /></div>
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

export default MasterCategories;
