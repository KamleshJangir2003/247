import React, { useState } from "react";
import "./header.css";
import logo from "../assets/images/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaUserCircle, FaWallet, FaBars, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Home",         path: "/home" },
  { label: "Sportsbook",   path: "/sportsbook1" },
  { label: "Exchange",     path: "/exchange" },
  { label: "Live Casino",  path: "/live-casino" },
  { label: "Slot",         path: "/slot" },
  { label: "Fantasy",      path: "/fantasy-games" },
  { label: "Crash",        path: "/crash" },
  { label: "Lottery",      path: "/lottery" },
];

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [balance] = useState(5000);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path) => { setMobileOpen(false); navigate(path); };
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setMobileOpen(false);
    navigate("/home");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div className={`header-mobile-overlay${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* MOBILE NAV DRAWER */}
      <nav className={`header-mobile-nav${mobileOpen ? " open" : ""}`}>
        <button className="header-mobile-nav-close" onClick={() => setMobileOpen(false)}><FaTimes /></button>
        {NAV_LINKS.map(l => (
          <button key={l.path} className="header-mobile-nav-item" onClick={() => handleNav(l.path)}>{l.label}</button>
        ))}
        {isLoggedIn ? (
          <>
            <button className="header-mobile-nav-item" onClick={() => handleNav("/deposit")}>💰 Deposit</button>
            <button className="header-mobile-nav-item" onClick={() => handleNav("/withdraw")}>💸 Withdraw</button>
            <button className="header-mobile-nav-item" onClick={() => handleNav("/profile")}>👤 Profile</button>
            <button className="header-mobile-nav-item" onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <button className="header-mobile-nav-item" onClick={() => handleNav("/login")}>Login</button>
            <button className="header-mobile-nav-item" onClick={() => handleNav("/dashboard")}>Demo</button>
          </>
        )}
      </nav>

      {/* TOP HEADER */}
      <div className="top-header">
        {/* HAMBURGER */}
        <button className="header-hamburger" onClick={() => setMobileOpen(true)}><FaBars /></button>

        {/* LOGO */}
        <div className="logo-section">
          <Link to="/home">
            <img src={logo} alt="logo" className="main-logo" />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-header">
          <div className="moon-icon"><FaMoon /></div>

          {isLoggedIn ? (
            <>
              <div className="header-balance">
                <FaWallet style={{ marginRight: 5 }} />
                ₹{balance.toLocaleString("en-IN")}
              </div>
              <button className="deposit-btn" onClick={() => navigate("/deposit")}>Deposit</button>
              <button className="withdraw-btn" onClick={() => navigate("/withdraw")}>Withdraw</button>
              <div className="user-menu-wrap" onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUserCircle className="user-icon" />
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div onClick={() => { setShowUserMenu(false); navigate("/deposit"); }}>💰 Deposit</div>
                    <div onClick={() => { setShowUserMenu(false); navigate("/withdraw"); }}>💸 Withdraw</div>
                    <div onClick={() => { setShowUserMenu(false); handleLogout(); }}>🚪 Logout</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
              <Link to="/dashboard"><button className="demo-btn">Demo</button></Link>
            </>
          )}
        </div>
      </div>

      {/* MATCH BAR */}
      <div className="match-bar">
        <div className="upcoming-box">Upcoming <br /> Fixture</div>
        <div className="match-scroll">
          <div className="match-item">⚪ Shimizu/Watanabe v Basel/Oliveira<span>29/05/2026 12:50:00 AM</span></div>
          <div className="match-item">⚪ Gujarat Titans v Rajasthan Royals<span>29/05/2026 7:30:00 PM</span></div>
          <div className="match-item">⚪ Hampshire W v Surrey W<span>29/05/2026 7:30:00 PM</span></div>
          <div className="match-item">⚪ Worcestershire v Warwickshire<span>29/05/2026 10:00:00 PM</span></div>
        </div>
      </div>
    </>
  );
};

export default Header;
