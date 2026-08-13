import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, title: "Site Maintenance",  message: "Scheduled maintenance on 1st June 2-4 AM IST.", type: "warning", enabled: true,  date: "28 May 2024" },
  { id: 2, title: "New Game Added",    message: "Aviator 2.0 is now live! Try your luck.",        type: "info",    enabled: true,  date: "27 May 2024" },
  { id: 3, title: "Bonus Offer",       message: "Deposit ₹1000 and get ₹200 bonus this weekend.", type: "success", enabled: false, date: "25 May 2024" },
];

const TYPES = ["info", "success", "warning", "danger"];

const MasterAnnouncements = () => {
  const { user } = useAuth();
  const [items, setItems] = useState(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" });

  const toggle = (id) => {
    setItems(items.map(a => {
      if (a.id !== id) return a;
      addLog(user.username, user.role, `${a.enabled ? "Disabled" : "Enabled"} announcement`, a.title);
      return { ...a, enabled: !a.enabled };
    }));
  };

  const remove = (id, title) => {
    setItems(items.filter(a => a.id !== id));
    addLog(user.username, user.role, "Deleted announcement", title);
  };

  const handleAdd = () => {
    if (!form.title || !form.message) return;
    setItems([...items, { id: Date.now(), ...form, enabled: true, date: new Date().toLocaleDateString("en-IN") }]);
    addLog(user.username, user.role, "Added announcement", form.title);
    setShowModal(false);
    setForm({ title: "", message: "", type: "info" });
  };

  const typeColor = { info: "#4a9eff", success: "#4ade80", warning: "#fbbf24", danger: "#f87171" };

  return (
    <MasterLayout pageTitle="Announcements">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Announcements</h3>
          <button className="p-btn-add" onClick={() => setShowModal(true)}><FaPlus /> Add</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Title</th><th>Message</th><th>Type</th><th>Date</th><th>Status</th><th>Toggle</th><th>Delete</th></tr></thead>
              <tbody>
                {items.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{a.title}</td>
                    <td style={{ fontSize: 11, maxWidth: 220, color: "#7a9ab8" }}>{a.message}</td>
                    <td><span style={{ color: typeColor[a.type], fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{a.type}</span></td>
                    <td style={{ fontSize: 11, color: "#4a6a8a" }}>{a.date}</td>
                    <td><span className={`p-badge ${a.enabled ? "enabled" : "disabled"}`}>{a.enabled ? "Active" : "Inactive"}</span></td>
                    <td>
                      <label className="p-toggle">
                        <input type="checkbox" checked={a.enabled} onChange={() => toggle(a.id)} />
                        <span className="p-toggle-slider" />
                      </label>
                    </td>
                    <td><button className="p-btn p-btn-delete" onClick={() => remove(a.id, a.title)}><FaTrash /></button></td>
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
              <h3>Add Announcement</h3>
              <button className="p-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" /></div>
                <div className="p-form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="p-form-group full">
                  <label>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Announcement message..." />
                </div>
              </div>
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleAdd}>Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterAnnouncements;
