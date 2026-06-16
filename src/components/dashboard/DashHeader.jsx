import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars, FaWallet, FaBell, FaUserCircle, FaSearch,
  FaChevronDown, FaStar
} from "react-icons/fa";
import "./DashHeader.css";

const DashHeader = ({ onMenuClick }) => {
  const [activeNav, setActiveNav] = useState("Home");

  const navLinks = ["Home", "In-Play", "Cricket", "Football", "Tennis", "Casino", "Slots"];

  return (
    <header className="dh-root">
      {/* TOP BAR */}
      <div className="dh-top">
        {/* LEFT: Hamburger + Logo */}
        <div className="dh-left">
          <button className="dh-hamburger" onClick={onMenuClick}>
            <FaBars />
          </button>
          <Link to="/dashboard" className="dh-logo">
            <span className="dh-logo-icon">🎰</span>
            <span className="dh-logo-text">777<span className="dh-logo-accent">GAMES</span></span>
          </Link>
        </div>

        {/* CENTER: Search */}
        <div className="dh-search">
          <FaSearch className="dh-search-icon" />
          <input type="text" placeholder="Search events, teams..." />
        </div>

        {/* RIGHT: Wallet + User */}
        <div className="dh-right">
          <div className="dh-balance">
            <FaWallet className="dh-balance-icon" />
            <div className="dh-balance-info">
              <span className="dh-balance-label">Balance</span>
              <span className="dh-balance-amount">₹ 25,430.00</span>
            </div>
          </div>
          <button className="dh-deposit-btn">+ Deposit</button>
          <div className="dh-bell">
            <FaBell />
            <span className="dh-bell-dot" />
          </div>
          <div className="dh-user">
            <FaUserCircle className="dh-user-icon" />
            <span className="dh-username">Player01</span>
            <FaChevronDown className="dh-chevron" />
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="dh-nav">
        <div className="dh-nav-inner">
          {navLinks.map((link) => (
            <button
              key={link}
              className={`dh-nav-btn ${activeNav === link ? "dh-nav-btn--active" : ""}`}
              onClick={() => setActiveNav(link)}
            >
              {link === "In-Play" && <span className="dh-live-dot" />}
              {link}
            </button>
          ))}
          <button className="dh-nav-btn dh-nav-btn--promo">
            <FaStar /> Promotions
          </button>
        </div>
      </nav>
    </header>
  );
};

export default DashHeader;
