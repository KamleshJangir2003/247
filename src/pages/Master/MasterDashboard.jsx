import React from "react";
import { Link } from "react-router-dom";
import MasterLayout from "./MasterLayout";
import { FaUsers, FaUserTie, FaUserShield, FaGamepad, FaMoneyBillWave, FaArrowCircleUp } from "react-icons/fa";
import { getLogs } from "../../data/activityLog";

const stats = [
  { icon: <FaUserShield />, color: "purple", label: "Total Admins",   value: "3",         sub: "Active" },
  { icon: <FaUserTie />,    color: "teal",   label: "Total Agents",   value: "12",        sub: "Active" },
  { icon: <FaUsers />,      color: "blue",   label: "Total Users",    value: "1,248",     sub: "+12 today" },
  { icon: <FaGamepad />,    color: "amber",  label: "Total Games",    value: "88",        sub: "Enabled" },
  { icon: <FaMoneyBillWave />, color: "green", label: "Total Deposits",  value: "₹4,82,500", sub: "All time" },
  { icon: <FaArrowCircleUp />, color: "red",   label: "Total Withdrawals", value: "₹2,14,000", sub: "All time" },
];

const MasterDashboard = () => {
  const logs = getLogs().slice(0, 6);
  return (
    <MasterLayout pageTitle="Dashboard">
      <div className="p-stats-grid">
        {stats.map((s, i) => (
          <div className="p-stat-card" key={i}>
            <div className={`p-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="p-stat-info">
              <p>{s.label}</p>
              <h3>{s.value}</h3>
              <div className="p-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-bottom-grid">
        <div className="p-card">
          <div className="p-card-header">
            <h3>Quick Links</h3>
          </div>
          <div className="p-card-body" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Manage Admins",  path: "/master/admins" },
              { label: "Manage Agents",  path: "/master/agents" },
              { label: "Manage Users",   path: "/master/users" },
              { label: "Games Catalog",  path: "/master/games" },
              { label: "Banners",        path: "/master/banners" },
              { label: "Permissions",    path: "/master/permissions" },
              { label: "Activity Logs",  path: "/master/activity" },
              { label: "Settings",       path: "/master/settings" },
            ].map(l => (
              <Link key={l.path} to={l.path} className="p-btn p-btn-primary" style={{ textDecoration: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-card">
          <div className="p-card-header">
            <h3>Recent Activity</h3>
            <Link to="/master/activity" className="p-view-all">View All →</Link>
          </div>
          <div className="p-card-body" style={{ padding: 0 }}>
            <table className="p-mini-table">
              <thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>Date</th></tr></thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id}>
                    <td><span className={`p-badge ${l.role}`}>{l.actor}</span></td>
                    <td>{l.action}</td>
                    <td>{l.target}</td>
                    <td style={{ color: "#4a6a8a", fontSize: 11 }}>{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterDashboard;
