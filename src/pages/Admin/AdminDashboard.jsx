import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { FaUsers, FaMoneyBillWave, FaArrowCircleUp, FaChartLine } from "react-icons/fa";
import { dashboard } from "../../api/admin";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard().then((res) => {
      if (res?.success) setData(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { icon: <FaUsers />,         color: "blue",   label: "Total Users",        value: data.totalUsers,        sub: "Registered" },
    { icon: <FaMoneyBillWave />, color: "amber",  label: "Pending Deposits",   value: data.pendingDeposits,   sub: "Needs action", warn: true },
    { icon: <FaArrowCircleUp />, color: "red",    label: "Pending Withdrawals",value: data.pendingWithdrawals,sub: "Needs action", warn: true },
    { icon: <FaChartLine />,     color: "green",  label: "Audit Events",       value: data.recentAudit?.length ?? 0, sub: "Recent" },
  ] : [];

  const logs = data?.recentAudit ?? [];

  return (
    <AdminLayout pageTitle="Dashboard" pendingDeposits={data?.pendingDeposits ?? 0} pendingWithdrawals={data?.pendingWithdrawals ?? 0}>
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
                  <div className={`p-stat-sub ${s.warn ? "warn" : ""}`}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-card" style={{ marginTop: 0 }}>
            <div className="p-card-header">
              <h3>Recent Activity</h3>
              <Link to="/super/activity" className="p-view-all">View All →</Link>
            </div>
            <div className="p-card-body" style={{ padding: 0 }}>
              <table className="p-mini-table">
                <thead><tr><th>Actor</th><th>Role</th><th>Action</th><th>Target</th><th>Date</th></tr></thead>
                <tbody>
                  {logs.length === 0
                    ? <tr><td colSpan={5} className="p-nodata">No recent activity.</td></tr>
                    : logs.map((l, i) => (
                      <tr key={i}>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{l.actor?.username ?? "—"}</td>
                        <td><span className={`p-badge ${(l.actor?.role ?? "").toLowerCase()}`}>{l.actor?.role ?? "—"}</span></td>
                        <td>{l.action}</td>
                        <td style={{ color: "#7a9ab8" }}>{l.target}</td>
                        <td style={{ color: "#4a6a8a", fontSize: 11 }}>{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
