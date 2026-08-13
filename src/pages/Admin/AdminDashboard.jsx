import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { FaUsers, FaMoneyBillWave, FaArrowCircleUp, FaChartLine, FaGamepad } from "react-icons/fa";
import { getLogs } from "../../data/activityLog";

const stats = [
  { icon: <FaUsers />,         color: "blue",   label: "Total Users",       value: "1,248",     sub: "+12 today",    warn: false },
  { icon: <FaMoneyBillWave />, color: "green",  label: "Total Deposits",    value: "₹4,82,500", sub: "+₹12,000 today",warn: false },
  { icon: <FaArrowCircleUp />, color: "red",    label: "Total Withdrawals", value: "₹2,14,000", sub: "+₹8,000 today", warn: false },
  { icon: <FaChartLine />,     color: "amber",  label: "Pending Deposits",  value: "8",         sub: "Needs action",  warn: true  },
  { icon: <FaGamepad />,       color: "purple", label: "Active Sessions",   value: "347",       sub: "Right now",     warn: false },
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

const AdminDashboard = () => {
  const logs = getLogs().slice(0, 5);
  return (
    <AdminLayout pageTitle="Dashboard" pendingDeposits={3} pendingWithdrawals={2}>
      <div className="p-stats-grid">
        {stats.map((s, i) => (
          <div className="p-stat-card" key={i}>
            <div className={`p-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="p-stat-info">
              <p>{s.label}</p>
              <h3>{s.value}</h3>
              <div className={`p-stat-sub ${s.warn ? "warn" : ""}`}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-bottom-grid">
        <div className="p-card">
          <div className="p-card-header">
            <h3>Recent Deposits</h3>
            <Link to="/admin/deposits" className="p-view-all">View All →</Link>
          </div>
          <div className="p-card-body" style={{ padding: 0 }}>
            <table className="p-mini-table">
              <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentDeposits.map((r, i) => (
                  <tr key={i}>
                    <td>{r.user}</td>
                    <td style={{ color: "#4ade80" }}>{r.amount}</td>
                    <td>{r.method}</td>
                    <td><span className={`p-badge ${r.status}`}>{r.status}</span></td>
                    <td style={{ color: "#4a6a8a", fontSize: 11 }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-card">
          <div className="p-card-header">
            <h3>Recent Withdrawals</h3>
            <Link to="/admin/withdrawals" className="p-view-all">View All →</Link>
          </div>
          <div className="p-card-body" style={{ padding: 0 }}>
            <table className="p-mini-table">
              <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentWithdrawals.map((r, i) => (
                  <tr key={i}>
                    <td>{r.user}</td>
                    <td style={{ color: "#f87171" }}>{r.amount}</td>
                    <td>{r.method}</td>
                    <td><span className={`p-badge ${r.status}`}>{r.status}</span></td>
                    <td style={{ color: "#4a6a8a", fontSize: 11 }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-card" style={{ marginTop: 0 }}>
        <div className="p-card-header">
          <h3>Recent Activity</h3>
          <Link to="/admin/activity" className="p-view-all">View All →</Link>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <table className="p-mini-table">
            <thead><tr><th>Actor</th><th>Role</th><th>Action</th><th>Target</th><th>Date</th></tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{l.actor}</td>
                  <td><span className={`p-badge ${l.role}`}>{l.role}</span></td>
                  <td>{l.action}</td>
                  <td style={{ color: "#7a9ab8" }}>{l.target}</td>
                  <td style={{ color: "#4a6a8a", fontSize: 11 }}>{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
