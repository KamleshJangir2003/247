import React from "react";
import AgentLayout from "./AgentLayout";
import { INIT_USERS } from "../../data/usersData";
import { useAuth } from "../../context/AuthContext";
import { FaUsers, FaMoneyBillWave, FaUserCheck, FaUserSlash } from "react-icons/fa";

const AgentReports = () => {
  const { user } = useAuth();
  const myUsers = INIT_USERS.filter(u => u.agent === user?.username);
  const totalBalance = myUsers.reduce((s, u) => s + u.balance, 0);
  const active = myUsers.filter(u => u.status === "active").length;
  const blocked = myUsers.filter(u => u.status === "blocked").length;

  const stats = [
    { icon: <FaUsers />,        color: "blue",  label: "Total Users",   value: myUsers.length },
    { icon: <FaUserCheck />,    color: "green", label: "Active",        value: active },
    { icon: <FaUserSlash />,    color: "red",   label: "Blocked",       value: blocked },
    { icon: <FaMoneyBillWave />,color: "amber", label: "Total Balance", value: `₹${totalBalance.toLocaleString("en-IN")}` },
  ];

  return (
    <AgentLayout pageTitle="Reports">
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
        <div className="p-card-header"><h3>User Balance Report</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <table className="p-table">
            <thead><tr><th>#</th><th>Username</th><th>Name</th><th>Balance</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {myUsers.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                  <td>{u.name}</td>
                  <td style={{ color: "#4ade80", fontWeight: 600 }}>₹{u.balance.toLocaleString("en-IN")}</td>
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

export default AgentReports;
