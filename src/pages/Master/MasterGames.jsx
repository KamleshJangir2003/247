import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { getGames, addGame, updateGame, toggleGame, deleteGame, CATEGORIES, SUBCATEGORIES, PROVIDERS, BADGES } from "../../data/gamesCatalog";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { name: "", category: "Live Casino", subCategory: "", provider: "Demo", badge: "LIVE", isNew: false, isFeatured: false, isPopular: false, imageUrl: "", demoUrl: "" };
const PAGE_SIZE = 8;

const MasterGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState(getGames());
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | "add" | game object
  const [form, setForm] = useState(EMPTY);

  const refresh = () => setGames(getGames());

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (g) => { setForm({ ...g }); setModal(g); };

  const handleToggle = (id, name) => {
    toggleGame(id);
    addLog(user.username, user.role, "Toggled game", name);
    refresh();
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    deleteGame(id);
    addLog(user.username, user.role, "Deleted game", name);
    refresh();
  };

  const handleSave = () => {
    if (!form.name) return;
    if (modal === "add") {
      addGame({ ...form, enabled: true });
      addLog(user.username, user.role, "Added game", form.name);
    } else {
      updateGame(modal.id, form);
      addLog(user.username, user.role, "Updated game", form.name);
    }
    refresh();
    setModal(null);
  };

  const filtered = games.filter(g => {
    const matchQ = g.name.toLowerCase().includes(search.toLowerCase());
    const matchC = catFilter === "all" || g.category === catFilter;
    return matchQ && matchC;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const subCats = SUBCATEGORIES[form.category] || [];

  return (
    <MasterLayout pageTitle="Games Management">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total Games</p><h4>{games.length}</h4></div>
        <div className="p-sum-card"><p>Enabled</p><h4 style={{ color: "#4ade80" }}>{games.filter(g => g.enabled).length}</h4></div>
        <div className="p-sum-card"><p>Disabled</p><h4 style={{ color: "#f87171" }}>{games.filter(g => !g.enabled).length}</h4></div>
        <div className="p-sum-card"><p>Featured</p><h4 style={{ color: "#fbbf24" }}>{games.filter(g => g.isFeatured).length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Catalog</h3>
          <div className="p-search-bar">
            <input placeholder="Search game..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 180 }} />
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="p-btn-add" onClick={openAdd}><FaPlus /> Add Game</button>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Category</th><th>Sub-Category</th><th>Provider</th><th>Badge</th><th>Tags</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={9} className="p-nodata">No games found.</td></tr>
                  : paginated.map((g, i) => (
                    <tr key={g.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{g.name}</td>
                      <td><span className="p-badge user">{g.category}</span></td>
                      <td style={{ fontSize: 11, color: "#7a9ab8" }}>{g.subCategory}</td>
                      <td style={{ fontSize: 11 }}>{g.provider}</td>
                      <td><span className="p-badge pending">{g.badge}</span></td>
                      <td style={{ fontSize: 10, color: "#4a6a8a" }}>
                        {g.isNew && <span style={{ marginRight: 4 }}>NEW</span>}
                        {g.isFeatured && <span style={{ marginRight: 4 }}>⭐</span>}
                        {g.isPopular && <span>🔥</span>}
                      </td>
                      <td>
                        <label className="p-toggle">
                          <input type="checkbox" checked={g.enabled} onChange={() => handleToggle(g.id, g.name)} />
                          <span className="p-toggle-slider" />
                        </label>
                      </td>
                      <td>
                        <div className="p-action-btns">
                          <button className="p-btn p-btn-edit" onClick={() => openEdit(g)}><FaEdit /></button>
                          <button className="p-btn p-btn-delete" onClick={() => handleDelete(g.id, g.name)}><FaTrash /></button>
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
                <div className="p-form-group full">
                  <label>Game Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Game name" />
                </div>
                <div className="p-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, subCategory: "" })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Sub-Category</label>
                  <select value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })}>
                    <option value="">Select...</option>
                    {subCats.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Provider</label>
                  <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}>
                    {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Badge</label>
                  <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                    {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="p-form-group full">
                  <label>Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="p-form-group full">
                  <label>Demo URL</label>
                  <input value={form.demoUrl || ""} onChange={e => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                {[
                  { key: "isNew", label: "New" },
                  { key: "isFeatured", label: "Featured" },
                  { key: "isPopular", label: "Popular" },
                ].map(t => (
                  <label key={t.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c8d8e8", cursor: "pointer" }}>
                    <input type="checkbox" checked={form[t.key]} onChange={e => setForm({ ...form, [t.key]: e.target.checked })} />
                    {t.label}
                  </label>
                ))}
              </div>
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setModal(null)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleSave}>Save Game</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterGames;
