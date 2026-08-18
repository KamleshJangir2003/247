import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo2.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./TopNav.css";

const links = [
  { label: "Lottery",       path: "/lottery" },
  { label: "SportBook1",    path: "/sportsbook1" },
  { label: "Exchange",      path: "/exchange" },
  { label: "Live Casino",   path: "/live-casino" },
  { label: "Slot",          path: "/slot" },
  { label: "Fantasy Games", path: "/fantasy-games" },
  { label: "Crash",         path: "/crash" },
];

const menuItems = [
  { icon: "💰", label: "Deposit",             path: "/deposit" },
  { icon: "💸", label: "Withdraw",            path: "/withdraw" },
  { icon: "📋", label: "Transaction History", path: "/transactions" },
  { icon: "👤", label: "My Profile",          path: "/profile" },
  { icon: "🔒", label: "Change Password",     path: "/change-password" },
  { icon: "🎁", label: "Bonus",               path: "/bonus" },
  { icon: "📞", label: "Support",             path: "/support" },
];

const TopNav = () => {
  const location    = useLocation();
  const navigate    = useNavigate();
  const { logout }  = useAuth();
  const [showMenu, setShowMenu]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const balance = 5000;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path) => { setShowMenu(false); setDrawerOpen(false); navigate(path); };

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    setDrawerOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className={`top-nav-drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />

      <nav className={`top-nav-drawer${drawerOpen ? " open" : ""}`}>
        <button className="top-nav-drawer-close" onClick={() => setDrawerOpen(false)}><FaTimes /></button>
        {links.map(l => (
          <button key={l.path} className="top-nav-drawer-item" onClick={() => handleNav(l.path)}>{l.label}</button>
        ))}
        <div style={{ borderTop: "1px solid #2a2a4a", marginTop: 8, paddingTop: 8 }}>
          {menuItems.map(item => (
            <button key={item.path} className="top-nav-drawer-item" onClick={() => handleNav(item.path)}>
              {item.icon} {item.label}
            </button>
          ))}
          <button className="top-nav-drawer-item" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </nav>

      <div className="top-nav">
        <button className="top-nav-hamburger" onClick={() => setDrawerOpen(true)}><FaBars /></button>

        <Link to="/dashboard" className="top-nav-logo">
          <img src={logo} alt="logo" className="top-nav-logo-img" />
        </Link>

        {links.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`top-nav-item${location.pathname === item.path ? " top-nav-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}

        <div className="top-nav-right">
          <div className="top-nav-balance">₹{balance.toLocaleString("en-IN")}</div>
          <button className="top-nav-deposit"  onClick={() => navigate("/deposit")}>💰 Deposit</button>
          <button className="top-nav-withdraw" onClick={() => navigate("/withdraw")}>💸 Withdraw</button>

          <div className="top-nav-user" ref={dropdownRef}>
            <div className="top-nav-user-icon" onClick={() => setShowMenu(!showMenu)}>👤</div>
            {showMenu && (
              <div className="top-nav-dropdown">
                {menuItems.map((item) => (
                  <div key={item.path} onClick={() => handleNav(item.path)}>
                    {item.icon} {item.label}
                  </div>
                ))}
                <div className="top-nav-logout" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
