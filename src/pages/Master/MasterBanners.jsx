import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, title: "Welcome Bonus",    url: "/deposit",    position: "Home Top",    enabled: true  },
  { id: 2, title: "IPL Special",      url: "/sportsbook1",position: "Home Top",    enabled: true  },
  { id: 3, title: "Casino Promo",     url: "/live-casino",position: "Home Middle", enabled: false },
  { id: 4, title: "Slot Jackpot",     url: "/slot",       position: "Slot Page",   enabled: true  },
];

const POSITIONS = ["Home Top", "Home Middle", "Home Bottom", "Slot Page", "Casino Page", "Sidebar"];

const MasterBanners = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", position: "Home Top", imageUrl: "" });

  const toggle = (id) => {
    setBanners(banners.map(b => {
      if (b.id !== id) return b;
      addLog(user.username, user.role, `${b.enabled ? "Disabled" : "Enabled"} banner`, b.title);
      return { ...b, enabled: !b.enabled };
    }));
  };

  const remove = (id, title) => {
    setBanners(banners.filter(b => b.id !== id));
    addLog(user.username, user.role, "Deleted banner", title);
  };

  const handleAdd = () => {
    if (!form.title) return;
    setBanners([...banners, { id: Date.now(), ...form, enabled: true }]);
    addLog(user.username, user.role, "Added banner", form.title);
    setShowModal(false);
    setForm({ title: "", url: "", position: "Home Top", imageUrl: "" });
  };

  return (
    <MasterLayout pageTitle="Banners">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Banner Management</h3>
          <button className="p-btn-add" onClick={() => setShowModal(true)}><FaPlus /> Add Banner</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Title</th><th>Link URL</th><th>Position</th><th>Status</th><th>Toggle</th><th>Delete</th></tr></thead>
              <tbody>
                {banners.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{b.title}</td>
                    <td style={{ fontSize: 11, color: "#4a9eff" }}>{b.url}</td>
                    <td><span className="p-badge admin">{b.position}</span></td>
                    <td><span className={`p-badge ${b.enabled ? "enabled" : "disabled"}`}>{b.enabled ? "Active" : "Inactive"}</span></td>
                    <td>
                      <label className="p-toggle">
                        <input type="checkbox" checked={b.enabled} onChange={() => toggle(b.id)} />
                        <span className="p-toggle-slider" />
                      </label>
                    </td>
                    <td><button className="p-btn p-btn-delete" onClick={() => remove(b.id, b.title)}><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <div className="p-modal-header">
              <h3>Add Banner</h3>
              <button className="p-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Banner title" /></div>
                <div className="p-form-group"><label>Link URL</label><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/deposit" /></div>
                <div className="p-form-group">
                  <label>Position</label>
                  <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="p-form-group"><label>Image URL</label><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
              </div>
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleAdd}>Add Banner</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterBanners;
