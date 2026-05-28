import React from "react";
import "./header.css";
import logo from "../assets/images/logo2.png";
import { Link } from "react-router-dom";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  return (
    <>
      {/* TOP HEADER */}
      <div className="top-header">

        {/* LOGO */}
        <div className="logo-section">
          <img src={logo} alt="logo" className="main-logo" />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-header">

          {/* MOON ICON */}
          <div className="moon-icon">
            <FaMoon />
          </div>

          {/* LOGIN BUTTON */}
          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

          {/* DEMO BUTTON */}
          <Link to="/demo">
            <button className="demo-btn">
              Demo
            </button>
          </Link>

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