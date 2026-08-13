import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge, FaUsers, FaUserTie, FaUserShield, FaGamepad,
  FaLayerGroup, FaBuilding, FaImage, FaBullhorn, FaKey,
  FaHistory, FaCog, FaSignOutAlt, FaBars, FaCrown
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../components/PanelShared.css";

const NAV = [
  { section: "Main" },
  { icon: <FaThLarge />,    label: "Dashboard",    path: "/master/dashboard" },
  { section: "Management" },
  { icon: <FaUserShield />, label: "Admins",        path: "/master/admins" },
  { icon: <FaUserTie />,    label: "Agents",        path: "/master/agents" },
  { icon: <FaUsers />,      label: "Users",         path: "/master/users" },
  { section: "Games" },
  { icon: <FaGamepad />,    label: "Games",         path: "/master/games" },
  { icon: <FaLayerGroup />, label: "Categories",    path: "/master/categories" },
  { icon: <FaBuilding />,   label: "Providers",     path: "/master/providers" },
  { section: "Content" },
  { icon: <FaImage />,      label: "Banners",       path: "/master/banners" },
  { icon: <FaBullhorn />,   label: "Announcements", path: "/master/announcements" },
  { section: "System" },
  { icon: <FaKey />,        label: "Permissions",   path: "/master/permissions" },
  { icon: <FaHistory />,    label: "Activity Logs", path: "/master/activity" },
  { icon: <FaCog />,        label: "Settings",      path: "/master/settings" },
];

const MasterLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="panel-wrap">
      <aside className={`panel-sidebar ${open ? "open" : ""}`}>
        <div className="panel-brand">
          <div className="panel-brand-icon">👑</div>
          <div className="panel-brand-text">
            <h2>777GAMES</h2>
            <p>Master Panel</p>
          </div>
        </div>
        <nav className="panel-nav">
          {NAV.map((item, i) => {
            if (item.section) return <div key={i} className="panel-nav-section">{item.section}</div>;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`panel-nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
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
            <div className="panel-role-badge"><FaCrown /> {user?.name || "Master"}</div>
          </div>
        </header>
        <div className="panel-content">{children}</div>
      </div>
    </div>
  );
};

export default MasterLayout;
