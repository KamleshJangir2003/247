import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { listGames, createGame, updateGame, deleteGame, setGameStatus, listProviders } from "../../api/games";

const CATEGORIES = ["Lottery", "Sports", "Exchange", "Live Casino", "Slot", "Fantasy", "Crash"];
const BADGES = ["", "HOT", "NEW", "LIVE"];
const PAGE_SIZE = 20;
const EMPTY = { name: "", category: "Live Casino", subCategory: "", provider: "", badge: "", isNew: false, isFeatured: false, isPopular: false, image: "", description: "" };

const AdminGames = () => {
  const [games, setGames]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [providers, setProviders] = useState([]);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [err, setErr]           = useState("");
  const [saving, setSaving]     = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const p = { page, limit: PAGE_SIZE };
    if (catFilter) p.category = catFilter;
    if (search) p.search = search;
    listGames(p).then(r => {
      if (r?.success) { setGames(r.data.games); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page, catFilter, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    listProviders({ limit: 100 }).then(r => { if (r?.success) setProviders(r.data.providers); });
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.category) return setErr("Name and category are required.");
    setSaving(true); setErr("");
    const res = modal === "add"
      ? await createGame(form)
      : await updateGame(modal._id, form);
    setSaving(false);
    if (!res?.success) return setErr(res?.message || "Save failed.");
    setModal(null); load();
  };

  const handleToggle = async (g) => {
    const next = g.status === "active" ? "inactive" : "active";
    const res = await setGameStatus(g._id, next);
    if (res?.success) load();
  };

  const handleDelete = async (g) => {
    if (!window.confirm(`Delete "${g.name}"?`)) return;
    const res = await deleteGame(g._id);
    if (res?.success) load();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const active = games.filter(g => g.status === "active").length;

  return (
    <AdminLayout pageTitle="Games Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{active}</h4></div>
        <div className="p-sum-card"><p>Inactive</p><h4 style={{ color: "#f87171" }}>{total - active}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Catalog</h3>
          <div className="p-search-bar">
            <input placeholder="Search game..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 160 }} />
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="p-btn-add" onClick={() => { setForm(EMPTY); setErr(""); setModal("add"); }}><FaPlus /> Add Game</button>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Provider</th><th>Badge</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : games.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No games found.</td></tr>
                    : games.map((g, i) => (
                      <tr key={g._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{g.name}</td>
                        <td><span className="p-badge user">{g.category}</span></td>
                        <td style={{ fontSize: 11 }}>{g.provider || "—"}</td>
                        <td>{g.badge ? <span className="p-badge pending">{g.badge}</span> : "—"}</td>
                        <td>
                          <label className="p-toggle">
                            <input type="checkbox" checked={g.status === "active"} onChange={() => handleToggle(g)} />
                            <span className="p-toggle-slider" />
                          </label>
                        </td>
                        <td>
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-edit" onClick={() => { setForm({ ...g }); setErr(""); setModal(g); }}><FaEdit /></button>
                            <button className="p-btn p-btn-delete" onClick={() => handleDelete(g)}><FaTrash /></button>
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

      {modal !== null && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>{modal === "add" ? "Add New Game" : `Edit: ${modal.name}`}</h3>
              <button className="p-modal-close" onClick={() => setModal(null)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group full"><label>Game Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Game name" /></div>
                <div className="p-form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, subCategory: "" })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Sub-Category</label>
                  <input value={form.subCategory || ""} onChange={e => setForm({ ...form, subCategory: e.target.value })} placeholder="Optional" />
                </div>
                <div className="p-form-group">
                  <label>Provider</label>
                  <select value={form.provider || ""} onChange={e => setForm({ ...form, provider: e.target.value })}>
                    <option value="">Select provider</option>
                    {providers.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Badge</label>
                  <select value={form.badge || ""} onChange={e => setForm({ ...form, badge: e.target.value })}>
                    {BADGES.map(b => <option key={b} value={b}>{b || "None"}</option>)}
                  </select>
                </div>
                <div className="p-form-group full"><label>Image URL</label><input value={form.image || ""} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
                <div className="p-form-group full"><label>Description</label><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" /></div>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                {[{ key: "isNew", label: "New" }, { key: "isFeatured", label: "Featured" }, { key: "isPopular", label: "Popular" }].map(t => (
                  <label key={t.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c8d8e8", cursor: "pointer" }}>
                    <input type="checkbox" checked={!!form[t.key]} onChange={e => setForm({ ...form, [t.key]: e.target.checked })} />
                    {t.label}
                  </label>
                ))}
              </div>
              {err && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{err}</p>}
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setModal(null)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Game"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGames;
