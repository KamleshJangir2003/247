import React from "react";
import AgentLayout from "./AgentLayout";
import { useAuth } from "../../context/AuthContext";
import { INIT_USERS } from "../../data/usersData";

const AgentProfile = () => {
  const { user } = useAuth();
  const myUsers = INIT_USERS.filter(u => u.agent === user?.username);

  return (
    <AgentLayout pageTitle="My Profile">
      <div className="p-card" style={{ maxWidth: 520 }}>
        <div className="p-card-header"><h3>Profile Information</h3></div>
        <div className="p-card-body">
          <div className="p-form-grid">
            {[
              ["Username", user?.username],
              ["Full Name", user?.name],
              ["Role", user?.role?.toUpperCase()],
              ["Total Users", myUsers.length],
              ["Active Users", myUsers.filter(u => u.status === "active").length],
            ].map(([label, val]) => (
              <div className="p-form-group" key={label}>
                <label>{label}</label>
                <div style={{ color: "#c8d8e8", fontSize: 13, padding: "8px 10px", background: "#0a0f1a", borderRadius: 6, border: "1px solid #1a2a3a" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentProfile;
