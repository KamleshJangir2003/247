import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminManage.css";

const INIT = [
  { id:1, user:"km****1851", amount:"₹2,000",  method:"UPI",  utr:"UTR123456001", date:"28 May, 11:02", proof:"receipt1.jpg", status:"pending"  },
  { id:2, user:"ra****7734", amount:"₹5,000",  method:"IMPS", utr:"UTR123456002", date:"28 May, 10:44", proof:"receipt2.jpg", status:"approved" },
  { id:3, user:"su****3312", amount:"₹1,000",  method:"UPI",  utr:"UTR123456003", date:"28 May, 10:21", proof:"receipt3.jpg", status:"pending"  },
  { id:4, user:"vi****9901", amount:"₹500",    method:"UPI",  utr:"UTR123456004", date:"28 May, 09:55", proof:"receipt4.jpg", status:"rejected" },
  { id:5, user:"mo****4421", amount:"₹10,000", method:"NEFT", utr:"UTR123456005", date:"28 May, 09:10", proof:"receipt5.jpg", status:"pending"  },
  { id:6, user:"pr****6672", amount:"₹3,000",  method:"UPI",  utr:"UTR123456006", date:"27 May, 18:30", proof:"receipt6.jpg", status:"approved" },
  { id:7, user:"an****2244", amount:"₹1,500",  method:"IMPS", utr:"UTR123456007", date:"27 May, 15:00", proof:"receipt7.jpg", status:"pending"  },
];

const PAGE_SIZE = 5;

const AdminDeposits = () => {
  const [rows, setRows]     = useState(INIT);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const updateStatus = (id, status) => setRows(rows.map(r => r.id === id ? { ...r, status } : r));

  const filtered = rows.filter(r => {
    const matchF = filter === "all" || r.status === filter;
    const matchS = r.user.toLowerCase().includes(search.toLowerCase()) || r.utr.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const total   = rows.reduce((a, r) => a + parseInt(r.amount.replace(/[₹,]/g, "")), 0);
  const pending  = rows.filter(r => r.status === "pending").length;
  const approved = rows.filter(r => r.status === "approved").length;

  return (
    <AdminLayout pageTitle="Deposit Requests" pendingDeposits={pending}>

      <div className="adm-summary-row">
        <div className="adm-sum-card"><p>Total Deposits</p><h4>₹{total.toLocaleString("en-IN")}</h4></div>
        <div className="adm-sum-card"><p>Pending</p><h4 style={{color:"#fbbf24"}}>{pending}</h4></div>
        <div className="adm-sum-card"><p>Approved</p><h4 style={{color:"#4ade80"}}>{approved}</h4></div>
        <div className="adm-sum-card"><p>Rejected</p><h4 style={{color:"#f87171"}}>{rows.filter(r=>r.status==="rejected").length}</h4></div>
      </div>

      <div className="adm-mgmt-header">
        <span className="adm-mgmt-title">All Deposit Requests</span>
        <div className="adm-search-bar">
          <input
            type="text"
            placeholder="Search user / UTR"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 220 }}
          />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th><th>User</th><th>Amount</th><th>Method</th><th>UTR</th><th>Date</th><th>Proof</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} className="adm-nodata">No records found.</td></tr>
            ) : paginated.map((r, i) => (
              <tr key={r.id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td style={{ color:"#c0d0e0", fontWeight:600 }}>{r.user}</td>
                <td style={{ color:"#4ade80", fontWeight:600 }}>{r.amount}</td>
                <td>{r.method}</td>
                <td style={{ fontFamily:"monospace", fontSize:11 }}>{r.utr}</td>
                <td>{r.date}</td>
                <td><span style={{ color:"#0078b3", fontSize:11, cursor:"pointer" }}>📄 {r.proof}</span></td>
                <td><span className={`adm-badge ${r.status}`}>{r.status}</span></td>
                <td>
                  {r.status === "pending" ? (
                    <div className="adm-action-btns">
                      <button className="adm-btn-approve" onClick={() => updateStatus(r.id, "approved")}>Approve</button>
                      <button className="adm-btn-reject"  onClick={() => updateStatus(r.id, "rejected")}>Reject</button>
                    </div>
                  ) : (
                    <span style={{ color:"#3a4a5a", fontSize:11 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="adm-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

    </AdminLayout>
  );
};

export default AdminDeposits;
