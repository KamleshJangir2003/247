import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { addLog } from "../../data/activityLog";
import { useAuth } from "../../context/AuthContext";

const INIT = [
  { id:1, user:"mo****4421", amount:"₹3,000", method:"Bank Transfer", account:"XXXX1234", ifsc:"SBIN0001234", date:"28 May, 10:55", status:"pending"  },
  { id:2, user:"km****1851", amount:"₹1,000", method:"UPI",           account:"km@upi",   ifsc:"—",           date:"28 May, 10:10", status:"approved" },
  { id:3, user:"pr****6672", amount:"₹5,000", method:"NEFT",          account:"XXXX5678", ifsc:"HDFC0002345", date:"28 May, 09:30", status:"pending"  },
  { id:4, user:"an****2244", amount:"₹2,500", method:"UPI",           account:"an@upi",   ifsc:"—",           date:"27 May, 18:45", status:"approved" },
  { id:5, user:"vi****9901", amount:"₹800",   method:"IMPS",          account:"XXXX9012", ifsc:"ICIC0003456", date:"27 May, 15:20", status:"rejected" },
  { id:6, user:"su****3312", amount:"₹4,500", method:"Bank Transfer", account:"XXXX3456", ifsc:"AXIS0004567", date:"27 May, 12:00", status:"pending"  },
];

const PAGE_SIZE = 5;

const AdminWithdrawals = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState(INIT);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const updateStatus = (id, status) => {
    const row = rows.find(r => r.id === id);
    addLog(user.username, "admin", `${status === "approved" ? "Approved" : "Rejected"} withdrawal`, row.user, row.amount);
    setRows(rows.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = rows.filter(r => {
    const matchF = filter === "all" || r.status === filter;
    const matchS = r.user.toLowerCase().includes(search.toLowerCase()) || r.account.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pending = rows.filter(r => r.status === "pending").length;

  return (
    <AdminLayout pageTitle="Withdrawal Requests" pendingWithdrawals={pending}>
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{rows.length}</h4></div>
        <div className="p-sum-card"><p>Pending</p><h4 style={{ color: "#fbbf24" }}>{pending}</h4></div>
        <div className="p-sum-card"><p>Approved</p><h4 style={{ color: "#4ade80" }}>{rows.filter(r => r.status === "approved").length}</h4></div>
        <div className="p-sum-card"><p>Rejected</p><h4 style={{ color: "#f87171" }}>{rows.filter(r => r.status === "rejected").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Withdrawal Requests</h3>
          <div className="p-search-bar">
            <input placeholder="Search user / account" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>User</th><th>Amount</th><th>Method</th><th>Account</th><th>IFSC</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={9} className="p-nodata">No records found.</td></tr>
                  : paginated.map((r, i) => (
                    <tr key={r.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{r.user}</td>
                      <td style={{ color: "#f87171", fontWeight: 600 }}>{r.amount}</td>
                      <td>{r.method}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.account}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.ifsc}</td>
                      <td>{r.date}</td>
                      <td><span className={`p-badge ${r.status}`}>{r.status}</span></td>
                      <td>
                        {r.status === "pending" ? (
                          <div className="p-action-btns">
                            <button className="p-btn p-btn-approve" onClick={() => updateStatus(r.id, "approved")}>Approve</button>
                            <button className="p-btn p-btn-reject"  onClick={() => updateStatus(r.id, "rejected")}>Reject</button>
                          </div>
                        ) : <span style={{ color: "#3a4a5a", fontSize: 11 }}>—</span>}
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
    </AdminLayout>
  );
};

export default AdminWithdrawals;
