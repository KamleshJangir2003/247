import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaThLarge, FaUsers, FaMoneyBillWave, FaArrowCircleUp, FaExchangeAlt, FaSignOutAlt, FaBars, FaShieldAlt } from "react-icons/fa";
import "./AdminLayout.css";

const navItems = [
  { section: "Main" },
  { icon: <FaThLarge />,        label: "Dashboard",   path: "/admin/dashboard" },
  { section: "Users" },
  { icon: <FaUsers />,          label: "All Users",   path: "/admin/users",       badge: null },
  { section: "Finance" },
  { icon: <FaMoneyBillWave />,  label: "Deposits",    path: "/admin/deposits",    badge: "deposits" },
  { icon: <FaArrowCircleUp />,  label: "Withdrawals", path: "/admin/withdrawals", badge: "withdrawals" },
  { icon: <FaExchangeAlt />,    label: "All Transactions", path: "/admin/transactions" },
];

const AdminLayout = ({ children, pageTitle, pendingDeposits = 0, pendingWithdrawals = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  const now = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getBadgeCount = (key) => {
    if (key === "deposits") return pendingDeposits;
    if (key === "withdrawals") return pendingWithdrawals;
    return 0;
  };

  return (
    <div className="adm-wrap">

      {/* SIDEBAR */}
      <aside className={`adm-sidebar ${open ? "open" : ""}`}>
        <div className="adm-sidebar-brand">
          <div className="adm-brand-icon">🛡️</div>
          <div className="adm-brand-text">
            <h2>777GAMES</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav className="adm-nav">
          {navItems.map((item, i) => {
            if (item.section) return <div key={i} className="adm-nav-section">{item.section}</div>;
            const count = item.badge ? getBadgeCount(item.badge) : 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`adm-nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="adm-icon">{item.icon}</span>
                {item.label}
                {count > 0 && <span className="adm-nav-badge">{count}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      <div className={`adm-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      {/* MAIN */}
      <div className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-menu-btn" onClick={() => setOpen(!open)}><FaBars /></button>
            <span className="adm-page-title">{pageTitle}</span>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-topbar-date">{now}</span>
            <div className="adm-admin-badge"><FaShieldAlt /> Admin</div>
          </div>
        </header>

        <div className="adm-content">{children}</div>
      </div>

    </div>
  );
};

export default AdminLayout;
