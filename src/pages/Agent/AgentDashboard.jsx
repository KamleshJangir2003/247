import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AgentLayout from "./AgentLayout";
import { FaUsers, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { agentDashboard, myUsers } from "../../api/agent";

const AgentDashboard = () => {
  const [dash, setDash]     = useState(null);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([agentDashboard(), myUsers({ limit: 5 })])
      .then(([d, u]) => {
        if (d?.success) setDash(d.data);
        if (u?.success) setUsers(u.data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <FaUsers />,         color: "blue",  label: "My Users",         value: dash?.totalUsers  ?? "—" },
    { icon: <FaUsers />,         color: "green", label: "Active Users",     value: dash?.activeUsers ?? "—" },
    { icon: <FaUsers />,         color: "red",   label: "Blocked Users",    value: dash?.blockedUsers ?? "—" },
    { icon: <FaWallet />,        color: "amber", label: "My Balance",       value: dash ? `₹${(dash.balance || 0).toLocaleString("en-IN")}` : "—" },
    { icon: <FaMoneyBillWave />, color: "teal",  label: "Pending Deposits", value: dash?.pendingDeposits ?? "—" },
    { icon: <FaMoneyBillWave />, color: "purple",label: "Pending Withdrawals", value: dash?.pendingWithdrawals ?? "—" },
  ];

  return (
    <AgentLayout pageTitle="Dashboard">
      {loading ? (
        <div style={{ color: "#7a9ab8", padding: 20 }}>Loading…</div>
      ) : (
        <>
          <div className="p-stats-grid">
            {stats.map((s, i) => (
              <div className="p-stat-card" key={i}>
                <div className={`p-stat-icon ${s.color}`}>{s.icon}</div>
                <div className="p-stat-info">
                  <p>{s.label}</p>
                  <h3>{s.value}</h3>
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
                <thead><tr><th>Username</th><th>Name</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.length === 0
                    ? <tr><td colSpan={4} className="p-nodata">No users yet.</td></tr>
                    : users.map(u => (
                      <tr key={u._id}>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                        <td>{`${u.firstName} ${u.lastName || ""}`.trim()}</td>
                        <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
                        <td style={{ color: "#4a6a8a", fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AgentLayout>
  );
};

export default AgentDashboard;
