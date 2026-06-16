import React, { useState } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import "./Transactions.css";

const allData = [
  { sn:1, type:"Deposit",  amount:"1,000", status:"Approved", date:"28/05/2026 10:22", method:"UPI",           ref:"UTR123456" },
  { sn:2, type:"Withdraw", amount:"500",   status:"Approved", date:"27/05/2026 18:45", method:"Bank Transfer", ref:"WD987654" },
  { sn:3, type:"Deposit",  amount:"5,000", status:"Pending",  date:"27/05/2026 09:10", method:"IMPS",          ref:"UTR654321" },
  { sn:4, type:"Withdraw", amount:"2,000", status:"Rejected", date:"26/05/2026 14:30", method:"UPI",           ref:"WD112233" },
  { sn:5, type:"Deposit",  amount:"500",   status:"Approved", date:"25/05/2026 11:00", method:"UPI",           ref:"UTR445566" },
];

const Transactions = () => {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? allData : allData.filter(d => d.type === filter);

  return (
    <div className="txn-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="txn-content">
          <div className="txn-header">
            <span className="txn-dot"></span> Transaction History
          </div>

          <div className="txn-filters">
            {["All","Deposit","Withdraw"].map(f => (
              <button key={f} className={filter === f ? "txn-filter-btn active" : "txn-filter-btn"} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          <div className="txn-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SN.</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Method</th><th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.sn}>
                    <td>{row.sn}</td>
                    <td><span className={`txn-type ${row.type.toLowerCase()}`}>{row.type}</span></td>
                    <td>₹{row.amount}</td>
                    <td><span className={`txn-status ${row.status.toLowerCase()}`}>{row.status}</span></td>
                    <td>{row.date}</td>
                    <td>{row.method}</td>
                    <td>{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="txn-nodata">No transactions found.</div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transactions;
