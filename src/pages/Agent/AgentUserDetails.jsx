import React, { useState } from "react";
import AgentLayout from "./AgentLayout";
import { INIT_USERS } from "../../data/usersData";
import { useAuth } from "../../context/AuthContext";

const AgentUserDetails = () => {
  const { user } = useAuth();
  const myUsers = INIT_USERS.filter(u => u.agent === user?.username);
  const [selected, setSelected] = useState(myUsers[0] || null);

  return (
    <AgentLayout pageTitle="User Details">
      <div className="p-bottom-grid">
        <div className="p-card">
          <div className="p-card-header"><h3>Select User</h3></div>
          <div className="p-card-body" style={{ padding: 0 }}>
            <table className="p-mini-table">
              <thead><tr><th>Username</th><th>Status</th></tr></thead>
              <tbody>
                {myUsers.map(u => (
                  <tr key={u.id} onClick={() => setSelected(u)} style={{ cursor: "pointer", background: selected?.id === u.id ? "#1a2a3a" : "" }}>
                    <td style={{ color: "#4a9eff" }}>{u.username}</td>
                    <td><span className={`p-badge ${u.status}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="p-card">
            <div className="p-card-header"><h3>Details: {selected.username}</h3></div>
            <div className="p-card-body">
              <div className="p-form-grid">
                {[
                  ["Username", selected.username],
                  ["Full Name", selected.name],
                  ["Mobile", selected.mobile],
                  ["Email", selected.email],
                  ["Balance", `₹${selected.balance.toLocaleString("en-IN")}`],
                  ["Joined", selected.joined],
                  ["Status", selected.status],
                  ["Agent", selected.agent],
                ].map(([label, val]) => (
                  <div className="p-form-group" key={label}>
                    <label>{label}</label>
                    <div style={{ color: "#c8d8e8", fontSize: 13, padding: "8px 10px", background: "#0a0f1a", borderRadius: 6, border: "1px solid #1a2a3a" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AgentLayout>
  );
};

export default AgentUserDetails;
