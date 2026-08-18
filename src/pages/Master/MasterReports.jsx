import React, { useState, useEffect } from "react";
import MasterLayout from "./MasterLayout";
import { masterReport } from "../../api/agent";
import { FaUsers, FaUserTie, FaMoneyBillWave, FaArrowCircleUp, FaExchangeAlt } from "react-icons/fa";

const MasterReports = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterReport().then(r => { if (r?.success) setData(r.data); }).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { icon: <FaUserTie />,       color: "teal",   label: "Total Agents",       value: data.totalAgents },
    { icon: <FaUsers />,         color: "blue",   label: "Total Users",        value: data.totalUsers },
    { icon: <FaMoneyBillWave />, color: "green",  label: "Total Deposits",     value: data.totalDeposits },
    { icon: <FaArrowCircleUp />, color: "red",    label: "Total Withdrawals",  value: data.totalWithdrawals },
    { icon: <FaExchangeAlt />,   color: "purple", label: "Total Transactions", value: data.totalTransactions },
    { icon: <FaMoneyBillWave />, color: "amber",  label: "Deposit Amount",     value: `₹${(data.totalDepositAmount || 0).toLocaleString("en-IN")}` },
    { icon: <FaArrowCircleUp />, color: "red",    label: "Withdrawal Amount",  value: `₹${(data.totalWithdrawalAmount || 0).toLocaleString("en-IN")}` },
  ] : [];

  return (
    <MasterLayout pageTitle="Reports">
      {loading ? (
        <div style={{ color: "#7a9ab8", padding: 20 }}>Loading…</div>
      ) : (
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
      )}
    </MasterLayout>
  );
};

export default MasterReports;
