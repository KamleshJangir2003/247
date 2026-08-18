import React, { useState, useEffect, useCallback } from "react";
import AgentLayout from "./AgentLayout";
import { myUsers, setUserStatus, agentTransferToUser, agentDebitUser } from "../../api/agent";
import { FaTimes } from "react-icons/fa";

const PAGE_SIZE = 20;

const AgentUsers = () => {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [showChips, setShowChips] = useState(null);
  const [chipsForm, setChipsForm] = useState({ amount: "", mode: "credit" });
  const [chipsErr, setChipsErr]   = useState("");

  const load = useCallback(() => {
    setLoading(true);
    myUsers({ page, limit: PAGE_SIZE }).then(res => {
      if (res?.success) { setUsers(res.data.users); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (u) => {
    const next = u.status === "active" ? "blocked" : "active";
    const res = await setUserStatus(u._id, next);
    if (res?.success) load();
  };

  const handleChips = async () => {
    const amount = Number(chipsForm.amount);
    if (!amount || amount <= 0) return setChipsErr("Enter a valid amount.");
    const fn = chipsForm.mode === "credit"
      ? agentTransferToUser({ userId: showChips._id, amount })
      : agentDebitUser({ userId: showChips._id, amount });
    const res = await fn;
    if (!res?.success) return setChipsErr(res?.message || "Operation failed.");
    setShowChips(null);
    setChipsForm({ amount: "", mode: "credit" });
    setChipsErr("");
    load();
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.username.toLowerCase().includes(q) ||
                   `${u.firstName} ${u.lastName || ""}`.toLowerCase().includes(q);
    const matchF = filter === "all" || u.status === filter;
    return matchQ && matchF;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AgentLayout pageTitle="My Users">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{users.filter(u => u.status === "active").length}</h4></div>
        <div className="p-sum-card"><p>Blocked</p><h4 style={{ color: "#f87171" }}>{users.filter(u => u.status === "blocked").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>My Users</h3>
          <div className="p-search-bar">
            <input placeholder="Search user..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Mobile</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={7} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={7} className="p-nodata">No users found.</td></tr>
                    : filtered.map((u, i) => (
                      <tr key={u._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                        <td>{`${u.firstName} ${u.lastName || ""}`.trim()}</td>
                        <td>{u.phone || "—"}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                        <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
                        <td>
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-primary" style={{ fontSize: 11 }} onClick={() => { setShowChips(u); setChipsErr(""); }}>Chips</button>
                            {u.status === "active"
                              ? <button className="p-btn p-btn-block"   onClick={() => toggle(u)}>Block</button>
                              : <button className="p-btn p-btn-unblock" onClick={() => toggle(u)}>Unblock</button>
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
                    <option value="credit">Credit (Transfer to User)</option>
                    <option value="debit">Debit (Recover from User)</option>
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
    </AgentLayout>
  );
};

export default AgentUsers;
