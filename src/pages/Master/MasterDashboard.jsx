import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MasterLayout from "./MasterLayout";
import { FaUsers, FaUserTie, FaMoneyBillWave, FaArrowCircleUp, FaWallet } from "react-icons/fa";
import { masterDashboard, masterReport } from "../../api/agent";

const MasterDashboard = () => {
  const [data, setData]     = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([masterDashboard(), masterReport()])
      .then(([d, r]) => {
        if (d?.success)  setData(d.data);
        if (r?.success)  setReport(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <FaUserTie />,       color: "teal",  label: "Total Agents",      value: data?.totalAgents ?? "—" },
    { icon: <FaUsers />,         color: "blue",  label: "Total Users",       value: data?.totalUsers  ?? "—" },
    { icon: <FaWallet />,        color: "green", label: "My Balance",        value: data ? `₹${data.balance.toLocaleString("en-IN")}` : "—" },
    { icon: <FaMoneyBillWave />, color: "amber", label: "Pending Deposits",  value: data?.pendingDeposits  ?? "—" },
    { icon: <FaArrowCircleUp />, color: "red",   label: "Pending Withdrawals", value: data?.pendingWithdrawals ?? "—" },
    { icon: <FaMoneyBillWave />, color: "purple",label: "Total Deposited",   value: report ? `₹${(report.totalDepositAmount || 0).toLocaleString("en-IN")}` : "—" },
  ];

  return (
    <MasterLayout pageTitle="Dashboard">
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

          <div className="p-bottom-grid">
            <div className="p-card">
              <div className="p-card-header"><h3>Quick Links</h3></div>
              <div className="p-card-body" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Manage Agents",  path: "/master/agents" },
                  { label: "Manage Users",   path: "/master/users" },
                  { label: "Activity Logs",  path: "/master/activity" },
                  { label: "Settings",       path: "/master/settings" },
                ].map(l => (
                  <Link key={l.path} to={l.path} className="p-btn p-btn-primary"
                    style={{ textDecoration: "none", padding: "7px 14px", borderRadius: 6, fontSize: 12 }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {data?.recentAudit?.length > 0 && (
              <div className="p-card">
                <div className="p-card-header">
                  <h3>Recent Activity</h3>
                  <Link to="/master/activity" className="p-view-all">View All →</Link>
                </div>
                <div className="p-card-body" style={{ padding: 0 }}>
                  <table className="p-mini-table">
                    <thead><tr><th>Actor</th><th>Action</th><th>Date</th></tr></thead>
                    <tbody>
                      {data.recentAudit.map(l => (
                        <tr key={l._id}>
                          <td><span className={`p-badge ${l.actor?.role?.toLowerCase()}`}>{l.actor?.username}</span></td>
                          <td>{l.action}</td>
                          <td style={{ color: "#4a6a8a", fontSize: 11 }}>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </MasterLayout>
  );
};

export default MasterDashboard;
