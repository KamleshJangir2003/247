import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaThLarge, FaUsers, FaUserTie, FaMoneyBillWave, FaArrowCircleUp,
  FaExchangeAlt, FaGamepad, FaLayerGroup, FaBuilding, FaImage,
  FaHistory, FaKey, FaSignOutAlt, FaBars, FaShieldAlt, FaCrown
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../components/PanelShared.css";

const NAV = [
  { section: "Main" },
  { icon: <FaThLarge />,       label: "Dashboard",       path: "/super/dashboard" },
  { section: "Users" },
  { icon: <FaUsers />,         label: "All Users",       path: "/super/users" },
  { icon: <FaCrown />,         label: "Masters",         path: "/super/masters" },
  { icon: <FaUserTie />,       label: "Agents",          path: "/super/agents" },
  { section: "Finance" },
  { icon: <FaMoneyBillWave />, label: "Deposits",        path: "/super/deposits",     badge: "deposits" },
  { icon: <FaArrowCircleUp />, label: "Withdrawals",     path: "/super/withdrawals",  badge: "withdrawals" },
  { icon: <FaExchangeAlt />,   label: "Transactions",    path: "/super/transactions" },
  { section: "Games" },
  { icon: <FaGamepad />,       label: "Games",           path: "/super/games" },
  { icon: <FaLayerGroup />,    label: "Categories",      path: "/super/categories" },
  { icon: <FaBuilding />,      label: "Providers",       path: "/super/providers" },
  { icon: <FaImage />,         label: "Banners",         path: "/super/banners" },
  { section: "System" },
  { icon: <FaHistory />,       label: "Activity Logs",   path: "/super/activity" },
  { icon: <FaKey />,           label: "Permissions",     path: "/super/permissions" },
];

const AdminLayout = ({ children, pageTitle, pendingDeposits = 0, pendingWithdrawals = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const getBadge = (key) => {
    if (key === "deposits") return pendingDeposits;
    if (key === "withdrawals") return pendingWithdrawals;
    return 0;
  };

  return (
    <div className="panel-wrap">
      <aside className={`panel-sidebar ${open ? "open" : ""}`}>
        <div className="panel-brand">
          <div className="panel-brand-icon">🛡️</div>
          <div className="panel-brand-text">
            <h2>777GAMES</h2>
            <p>Super Admin Panel</p>
          </div>
        </div>
        <nav className="panel-nav">
          {NAV.map((item, i) => {
            if (item.section) return <div key={i} className="panel-nav-section">{item.section}</div>;
            const count = item.badge ? getBadge(item.badge) : 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`panel-nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
                {count > 0 && <span className="panel-nav-badge">{count}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="panel-sidebar-footer">
          <button className="panel-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className={`panel-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <div className="panel-main">
        <header className="panel-topbar">
          <div className="panel-topbar-left">
            <button className="panel-menu-btn" onClick={() => setOpen(!open)}><FaBars /></button>
            <span className="panel-page-title">{pageTitle}</span>
          </div>
          <div className="panel-topbar-right">
            <span className="panel-topbar-date">
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <div className="panel-role-badge"><FaShieldAlt /> {user?.name || "Admin"}</div>
          </div>
        </header>
        <div className="panel-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
