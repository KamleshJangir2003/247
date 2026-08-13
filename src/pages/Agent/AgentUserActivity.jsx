import React, { useState } from "react";
import AgentLayout from "./AgentLayout";
import { getLogs } from "../../data/activityLog";
import { INIT_USERS } from "../../data/usersData";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 10;

const AgentUserActivity = () => {
  const { user } = useAuth();
  const myUsernames = INIT_USERS.filter(u => u.agent === user?.username).map(u => u.username);
  const [page, setPage] = useState(1);

  const logs = getLogs().filter(l => myUsernames.includes(l.target) || l.actor === user?.username);
  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AgentLayout pageTitle="User Activity">
      <div className="p-card">
        <div className="p-card-header"><h3>Activity Logs (My Users)</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Actor</th><th>Role</th><th>Action</th><th>Target</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {paginated.length === 0
                  ? <tr><td colSpan={7} className="p-nodata">No activity found.</td></tr>
                  : paginated.map((l, i) => (
                    <tr key={l.id}>
                      <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{l.actor}</td>
                      <td><span className={`p-badge ${l.role}`}>{l.role}</span></td>
                      <td>{l.action}</td>
                      <td style={{ color: "#7a9ab8" }}>{l.target}</td>
                      <td style={{ color: "#4ade80" }}>{l.amount}</td>
                      <td style={{ color: "#4a6a8a", fontSize: 11 }}>{l.date}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="p-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentUserActivity;
