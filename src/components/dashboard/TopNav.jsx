import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TopNav.css";

const links = [
  { label: "Lottery",       path: "/lottery" },
  { label: "SportBook1",    path: "/sportsbook1" },
  { label: "Exchange",      path: "/exchange" },
  { label: "Live Casino",   path: "/live-casino" },
  { label: "Slot",          path: "/slot" },
  { label: "Fantasy Games", path: "/fantasy-games" },
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
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const balance = 5000;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
    <div className="top-nav">
      {links.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`top-nav-item${location.pathname === item.path ? " top-nav-active" : ""}`}
        >
          {item.label}
        </Link>
      ))}

      {/* RIGHT SIDE */}
      <div className="top-nav-right">
        <div className="top-nav-balance">₹{balance.toLocaleString("en-IN")}</div>
        <button className="top-nav-deposit"  onClick={() => navigate("/deposit")}>💰 Deposit</button>
        <button className="top-nav-withdraw" onClick={() => navigate("/withdraw")}>💸 Withdraw</button>

        {/* USER DROPDOWN */}
        <div className="top-nav-user" ref={dropdownRef}>
          <div className="top-nav-user-icon" onClick={() => setShowMenu(!showMenu)}>
            👤
          </div>
          {showMenu && (
            <div className="top-nav-dropdown">
              {menuItems.map((item) => (
                <div key={item.path} onClick={() => handleNav(item.path)}>
                  {item.icon} {item.label}
                </div>
              ))}
              <div className="top-nav-logout" onClick={() => handleNav("/")}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
