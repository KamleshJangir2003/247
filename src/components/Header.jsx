import React, { useState } from "react";
import "./header.css";
import logo from "../assets/images/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaUserCircle, FaWallet } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  // Simulate logged-in state (in real app this comes from auth context)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance] = useState(5000);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* TOP HEADER */}
      <div className="top-header">

        {/* LOGO */}
        <div className="logo-section">
          <Link to="/home">
            <img src={logo} alt="logo" className="main-logo" />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-header">

          {/* MOON ICON */}
          <div className="moon-icon">
            <FaMoon />
          </div>

          {isLoggedIn ? (
            <>
              {/* BALANCE */}
              <div className="header-balance">
                <FaWallet style={{ marginRight: 5 }} />
                ₹{balance.toLocaleString("en-IN")}
              </div>

              {/* DEPOSIT BUTTON */}
              <button className="deposit-btn" onClick={() => navigate("/deposit")}>
                Deposit
              </button>

              {/* WITHDRAW BUTTON */}
              <button className="withdraw-btn" onClick={() => navigate("/withdraw")}>
                Withdraw
              </button>

              {/* USER MENU */}
              <div className="user-menu-wrap" onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUserCircle className="user-icon" />
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div onClick={() => navigate("/deposit")}>💰 Deposit</div>
                    <div onClick={() => navigate("/withdraw")}>💸 Withdraw</div>
                    <div onClick={() => setIsLoggedIn(false)}>🚪 Logout</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* LOGIN BUTTON */}
              <button className="login-btn" onClick={() => { setIsLoggedIn(true); navigate("/home"); }}>
                Login
              </button>

              {/* DEMO BUTTON */}
              <Link to="/dashboard">
                <button className="demo-btn">
                  Demo
                </button>
              </Link>
            </>
          )}

        </div>

      </div>

      {/* MATCH BAR */}
      <div className="match-bar">

        <div className="upcoming-box">
          Upcoming <br /> Fixure
        </div>

        <div className="match-scroll">

          <div className="match-item">
            ⚪ Shimizu/Watanabe v Basel/Oliveira
            <span>29/05/2026 12:50:00 AM</span>
          </div>

          <div className="match-item">
            ⚪ Gujarat Titans v Rajasthan Royals
            <span>29/05/2026 7:30:00 PM</span>
          </div>

          <div className="match-item">
            ⚪ Hampshire W v Surrey W
            <span>29/05/2026 7:30:00 PM</span>
          </div>

          <div className="match-item">
            ⚪ Worcestershire v Warwickshire
            <span>29/05/2026 10:00:00 PM</span>
          </div>

        </div>

      </div>
    </>
  );
};

export default Header;
