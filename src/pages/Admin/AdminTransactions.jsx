import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminManage.css";

const INIT = [
  { id:1,  type:"Deposit",    user:"km****1851", amount:"₹2,000",  method:"UPI",           ref:"UTR123456001", date:"28 May, 11:02", status:"pending"  },
  { id:2,  type:"Deposit",    user:"ra****7734", amount:"₹5,000",  method:"IMPS",          ref:"UTR123456002", date:"28 May, 10:44", status:"approved" },
  { id:3,  type:"Withdrawal", user:"mo****4421", amount:"₹3,000",  method:"Bank Transfer", ref:"WD000001",     date:"28 May, 10:55", status:"pending"  },
  { id:4,  type:"Deposit",    user:"su****3312", amount:"₹1,000",  method:"UPI",           ref:"UTR123456003", date:"28 May, 10:21", status:"pending"  },
  { id:5,  type:"Withdrawal", user:"km****1851", amount:"₹1,000",  method:"UPI",           ref:"WD000002",     date:"28 May, 10:10", status:"approved" },
  { id:6,  type:"Deposit",    user:"vi****9901", amount:"₹500",    method:"UPI",           ref:"UTR123456004", date:"28 May, 09:55", status:"rejected" },
  { id:7,  type:"Deposit",    user:"mo****4421", amount:"₹10,000", method:"NEFT",          ref:"UTR123456005", date:"28 May, 09:10", status:"pending"  },
  { id:8,  type:"Withdrawal", user:"pr****6672", amount:"₹5,000",  method:"NEFT",          ref:"WD000003",     date:"28 May, 09:30", status:"pending"  },
  { id:9,  type:"Deposit",    user:"pr****6672", amount:"₹3,000",  method:"UPI",           ref:"UTR123456006", date:"27 May, 18:30", status:"approved" },
  { id:10, type:"Withdrawal", user:"an****2244", amount:"₹2,500",  method:"UPI",           ref:"WD000004",     date:"27 May, 18:45", status:"approved" },
];

const PAGE_SIZE = 7;

const AdminTransactions = () => {
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = INIT.filter(r => {
    const matchT = filter === "all" || r.type.toLowerCase() === filter;
    const matchS = status === "all" || r.status === status;
    const matchQ = r.user.toLowerCase().includes(search.toLowerCase()) || r.ref.toLowerCase().includes(search.toLowerCase());
    return matchT && matchS && matchQ;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout pageTitle="All Transactions">

      <div className="adm-summary-row">
        <div className="adm-sum-card"><p>Total Records</p><h4>{INIT.length}</h4></div>
        <div className="adm-sum-card"><p>Deposits</p><h4 style={{color:"#4ade80"}}>{INIT.filter(r=>r.type==="Deposit").length}</h4></div>
        <div className="adm-sum-card"><p>Withdrawals</p><h4 style={{color:"#f87171"}}>{INIT.filter(r=>r.type==="Withdrawal").length}</h4></div>
        <div className="adm-sum-card"><p>Pending</p><h4 style={{color:"#fbbf24"}}>{INIT.filter(r=>r.status==="pending").length}</h4></div>
      </div>

      <div className="adm-mgmt-header">
        <span className="adm-mgmt-title">Transaction History</span>
        <div className="adm-search-bar">
          <input
            type="text"
            placeholder="Search user / reference"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 220 }}
          />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
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
              <th>#</th><th>Type</th><th>User</th><th>Amount</th><th>Method</th><th>Reference</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="adm-nodata">No records found.</td></tr>
            ) : paginated.map((r, i) => (
              <tr key={r.id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td>
                  <span style={{ color: r.type === "Deposit" ? "#4ade80" : "#f87171", fontWeight:600, fontSize:12 }}>
                    {r.type === "Deposit" ? "⬇ " : "⬆ "}{r.type}
                  </span>
                </td>
                <td style={{ color:"#c0d0e0", fontWeight:600 }}>{r.user}</td>
                <td style={{ color: r.type === "Deposit" ? "#4ade80" : "#f87171", fontWeight:600 }}>{r.amount}</td>
                <td>{r.method}</td>
                <td style={{ fontFamily:"monospace", fontSize:11 }}>{r.ref}</td>
                <td>{r.date}</td>
                <td><span className={`adm-badge ${r.status}`}>{r.status}</span></td>
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

export default AdminTransactions;
