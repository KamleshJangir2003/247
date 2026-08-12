import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { FaUsers, FaMoneyBillWave, FaArrowCircleUp, FaChartLine, FaGamepad } from "react-icons/fa";
import "./AdminDashboard.css";

const stats = [
  { icon: <FaUsers />,         color: "blue",   label: "Total Users",       value: "1,248",   sub: "+12 today",    subWarn: false },
  { icon: <FaMoneyBillWave />, color: "green",  label: "Total Deposits",    value: "₹4,82,500", sub: "+₹12,000 today", subWarn: false },
  { icon: <FaArrowCircleUp />, color: "red",    label: "Total Withdrawals", value: "₹2,14,000", sub: "+₹8,000 today",  subWarn: false },
  { icon: <FaChartLine />,     color: "amber",  label: "Pending Deposits",  value: "8",         sub: "Needs action",   subWarn: true  },
  { icon: <FaGamepad />,       color: "purple", label: "Active Sessions",   value: "347",       sub: "Right now",      subWarn: false },
];

const recentDeposits = [
  { user: "km****1851", amount: "₹2,000", method: "UPI",  status: "pending",  date: "28 May, 11:02" },
  { user: "ra****7734", amount: "₹5,000", method: "IMPS", status: "approved", date: "28 May, 10:44" },
  { user: "su****3312", amount: "₹1,000", method: "UPI",  status: "pending",  date: "28 May, 10:21" },
  { user: "vi****9901", amount: "₹500",   method: "UPI",  status: "rejected", date: "28 May, 09:55" },
];

const recentWithdrawals = [
  { user: "mo****4421", amount: "₹3,000", method: "Bank", status: "pending",  date: "28 May, 10:55" },
  { user: "km****1851", amount: "₹1,000", method: "UPI",  status: "approved", date: "28 May, 10:10" },
  { user: "pr****6672", amount: "₹5,000", method: "NEFT", status: "pending",  date: "28 May, 09:30" },
  { user: "an****2244", amount: "₹2,500", method: "UPI",  status: "approved", date: "27 May, 18:45" },
];

const AdminDashboard = () => (
  <AdminLayout pageTitle="Dashboard" pendingDeposits={3} pendingWithdrawals={2}>

    <div className="adm-stats-grid">
      {stats.map((s, i) => (
        <div className="adm-stat-card" key={i}>
          <div className={`adm-stat-icon ${s.color}`}>{s.icon}</div>
          <div className="adm-stat-info">
            <p>{s.label}</p>
            <h3>{s.value}</h3>
            <div className={`adm-stat-sub ${s.subWarn ? "warn" : ""}`}>{s.sub}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="adm-bottom-grid">

      {/* RECENT DEPOSITS */}
      <div className="adm-panel">
        <div className="adm-panel-header">
          <h3>Recent Deposits</h3>
          <Link to="/admin/deposits" className="adm-view-all">View All →</Link>
        </div>
        <table className="adm-mini-table">
          <thead>
            <tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {recentDeposits.map((r, i) => (
              <tr key={i}>
                <td>{r.user}</td>
                <td>{r.amount}</td>
                <td>{r.method}</td>
                <td><span className={`adm-badge ${r.status}`}>{r.status}</span></td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECENT WITHDRAWALS */}
      <div className="adm-panel">
        <div className="adm-panel-header">
          <h3>Recent Withdrawals</h3>
          <Link to="/admin/withdrawals" className="adm-view-all">View All →</Link>
        </div>
        <table className="adm-mini-table">
          <thead>
            <tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {recentWithdrawals.map((r, i) => (
              <tr key={i}>
                <td>{r.user}</td>
                <td>{r.amount}</td>
                <td>{r.method}</td>
                <td><span className={`adm-badge ${r.status}`}>{r.status}</span></td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
);

export default AdminDashboard;
