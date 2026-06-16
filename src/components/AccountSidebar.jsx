import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AccountSidebar.css";

const menuItems = [
  { icon: "💰", label: "Deposit",             path: "/deposit" },
  { icon: "💸", label: "Withdraw",            path: "/withdraw" },
  { icon: "📋", label: "Transaction History", path: "/transactions" },
  { icon: "👤", label: "My Profile",          path: "/profile" },
  { icon: "🔒", label: "Change Password",     path: "/change-password" },
  { icon: "🎁", label: "Bonus",               path: "/bonus" },
  { icon: "📞", label: "Support",             path: "/support" },
];

const AccountSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="acc-sidebar">
      <div className="acc-sidebar-header">My Account</div>
      {menuItems.map((item) => (
        <div
          key={item.label}
          className={`acc-sidebar-item${location.pathname === item.path ? " acc-active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span className="acc-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default AccountSidebar;
