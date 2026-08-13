import React from "react";
import { Link } from "react-router-dom";
import AgentLayout from "./AgentLayout";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { INIT_USERS } from "../../data/usersData";
import { useAuth } from "../../context/AuthContext";

const AgentDashboard = () => {
  const { user } = useAuth();
  const myUsers = INIT_USERS.filter(u => u.agent === user?.username);

  const stats = [
    { icon: <FaUsers />,         color: "blue",  label: "My Users",       value: myUsers.length,                                          sub: "Total" },
    { icon: <FaUsers />,         color: "green", label: "Active Users",   value: myUsers.filter(u => u.status === "active").length,        sub: "Active" },
    { icon: <FaUsers />,         color: "red",   label: "Blocked Users",  value: myUsers.filter(u => u.status === "blocked").length,       sub: "Blocked" },
    { icon: <FaMoneyBillWave />, color: "amber", label: "Total Balance",  value: `₹${myUsers.reduce((s, u) => s + u.balance, 0).toLocaleString("en-IN")}`, sub: "Combined" },
  ];

  return (
    <AgentLayout pageTitle="Dashboard">
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

      <div className="p-card">
        <div className="p-card-header">
          <h3>My Users</h3>
          <Link to="/agent/users" className="p-view-all">View All →</Link>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <table className="p-mini-table">
            <thead><tr><th>Username</th><th>Name</th><th>Balance</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {myUsers.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                  <td>{u.name}</td>
                  <td style={{ color: "#4ade80" }}>₹{u.balance.toLocaleString("en-IN")}</td>
                  <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
                  <td style={{ color: "#4a6a8a", fontSize: 11 }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentDashboard;
