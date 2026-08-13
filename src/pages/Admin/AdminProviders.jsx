import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FaPlus, FaTimes } from "react-icons/fa";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id: 1, name: "Demo",         category: "Live Casino", games: 22, enabled: true  },
  { id: 2, name: "Spribe",       category: "Crash",       games: 5,  enabled: true  },
  { id: 3, name: "JILI",         category: "Slot",        games: 8,  enabled: true  },
  { id: 4, name: "Habanero",     category: "Slot",        games: 6,  enabled: true  },
  { id: 5, name: "Red Tiger",    category: "Slot",        games: 4,  enabled: true  },
  { id: 6, name: "Hacksaw",      category: "Slot",        games: 3,  enabled: false },
];

const AdminProviders = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState(INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Slot" });

  const toggle = (id) => {
    setProviders(providers.map(p => {
      if (p.id !== id) return p;
      addLog(user.username, "admin", `${p.enabled ? "Disabled" : "Enabled"} provider`, p.name);
      return { ...p, enabled: !p.enabled };
    }));
  };

  const handleAdd = () => {
    if (!form.name) return;
    setProviders([...providers, { id: Date.now(), ...form, games: 0, enabled: true }]);
    addLog(user.username, "admin", "Added provider", form.name);
    setShowModal(false);
    setForm({ name: "", category: "Slot" });
  };

  return (
    <AdminLayout pageTitle="Providers">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Providers</h3>
          <button className="p-btn-add" onClick={() => setShowModal(true)}><FaPlus /> Add Provider</button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Provider</th><th>Category</th><th>Games</th><th>Status</th><th>Toggle</th></tr></thead>
              <tbody>
                {providers.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{p.name}</td>
                    <td><span className="p-badge user">{p.category}</span></td>
                    <td style={{ color: "#4a9eff" }}>{p.games}</td>
                    <td><span className={`p-badge ${p.enabled ? "enabled" : "disabled"}`}>{p.enabled ? "Enabled" : "Disabled"}</span></td>
                    <td>
                      <label className="p-toggle">
                        <input type="checkbox" checked={p.enabled} onChange={() => toggle(p.id)} />
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
              <h3>Add Provider</h3>
              <button className="p-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="p-modal-body">
              <div className="p-form-grid">
                <div className="p-form-group"><label>Provider Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Provider name" /></div>
                <div className="p-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {["Live Casino", "Slot", "Crash", "Sports", "Fantasy", "Lottery"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-form-actions">
                <button className="p-btn p-btn-primary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="p-btn p-btn-success" onClick={handleAdd}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProviders;
