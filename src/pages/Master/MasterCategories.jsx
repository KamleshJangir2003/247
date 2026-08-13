import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import { FaPlus, FaTimes } from "react-icons/fa";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, name: "Live Casino", icon: "🎰", order: 1, enabled: true  },
  { id: 2, name: "Slot",        icon: "🎮", order: 2, enabled: true  },
  { id: 3, name: "Crash",       icon: "✈️", order: 3, enabled: true  },
  { id: 4, name: "Sports",      icon: "⚽", order: 4, enabled: true  },
  { id: 5, name: "Fantasy",     icon: "🏆", order: 5, enabled: true  },
  { id: 6, name: "Lottery",     icon: "🎟️", order: 6, enabled: true  },
  { id: 7, name: "Exchange",    icon: "🔄", order: 7, enabled: false },
];

const MasterCategories = () => {
  const { user } = useAuth();
  const [cats, setCats] = useState(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "", order: "" });

  const toggle = (id) => {
    setCats(cats.map(c => {
      if (c.id !== id) return c;
      addLog(user.username, user.role, `${c.enabled ? "Disabled" : "Enabled"} category`, c.name);
      return { ...c, enabled: !c.enabled };
    }));
  };

  const handleAdd = () => {
    if (!form.name) return;
    setCats([...cats, { id: Date.now(), ...form, order: Number(form.order) || cats.length + 1, enabled: true }]);
    addLog(user.username, user.role, "Added category", form.name);
    setShowModal(false);
    setForm({ name: "", icon: "", order: "" });
  };

  return (
    <MasterLayout pageTitle="Categories">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Categories</h3>
          <button className="p-btn-add" onClick={() => setShowModal(true)}><FaPlus /> Add Category</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Icon</th><th>Name</th><th>Order</th><th>Status</th><th>Toggle</th></tr></thead>
              <tbody>
                {cats.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td style={{ fontSize: 20 }}>{c.icon}</td>
                    <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{c.name}</td>
                    <td>{c.order}</td>
                    <td><span className={`p-badge ${c.enabled ? "enabled" : "disabled"}`}>{c.enabled ? "Enabled" : "Disabled"}</span></td>
                    <td>
                      <label className="p-toggle">
                        <input type="checkbox" checked={c.enabled} onChange={() => toggle(c.id)} />
                        <span className="p-toggle-slider" />
                      </label>
                    </td>
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
              <h3>Add Category</h3>
              <button className="p-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" /></div>
                <div className="p-form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🎰" /></div>
                <div className="p-form-group"><label>Display Order</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} placeholder="1" /></div>
              </div>
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleAdd}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
};

export default MasterCategories;
