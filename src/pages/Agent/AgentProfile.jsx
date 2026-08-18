import React, { useState, useEffect } from "react";
import AgentLayout from "./AgentLayout";
import { useAuth } from "../../context/AuthContext";
import { myUsers } from "../../api/agent";

const AgentProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    myUsers({ limit: 1 }).then((res) => {
      if (res?.success) {
        setStats({ total: res.data.total, active: res.data.total });
      }
    }).catch(() => {});
  }, []);

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
              ["Total Users", stats.total],
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
