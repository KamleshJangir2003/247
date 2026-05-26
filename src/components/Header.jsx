import React from "react";
import "./header.css";
import logo from "../assets/images/logo2.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* TOP HEADER */}
      <div className="top-header">

        {/* LEFT LOGO */}
        <div className="logo-section">
          <img src={logo} alt="logo" className="main-logo" />
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">

          {/* BUTTONS */}
          <div className="header-buttons">
            <Link to="/deposit">
              <button className="deposit-btn">
                🏦 Deposit
              </button>
            </Link>

            <button className="withdraw-btn">
              🏛 Withdraw
            </button>
          </div>

          {/* DOWNLOAD APK */}
          <div className="download-apk">
            🔍 Download Apk ⬇
          </div>

          {/* BALANCE */}
          <div className="balance-area">

            <div className="balance-row">
              <span>
                Main Bal. : <b className="green">1,500</b>
              </span>

              <span>
                Exp : <b className="red">0</b>
              </span>
            </div>

            <div className="balance-row">
              <span>
                Bonus Bal. : <b>0</b>
              </span>

              <span>
                Hold Bal. : <b>0</b>
              </span>
            </div>

          </div>

          {/* USER DROPDOWN */}
          <div className="user-dropdown">
            <button className="dropdown-btn">
              Demo ▼
            </button>

            <div className="dropdown-menu">
              <p>Account Statement</p>
              <p>Profit Loss Report</p>
              <p>Bet History</p>
              <p>Unsettled Bet</p>
              <p>Casino Result</p>
              <p>Set Button Value</p>
              <p>Signout</p>
            </div>
          </div>

        </div>
      </div>

      {/* RUNNING BAR */}
      <div className="running-bar">
        <marquee>
          demo: demo descriptions cbzjkckzncjnzcn nz nv zv mz vmzvzvzvsvv
        </marquee>
      </div>

      {/* NAVBAR */}
      <div className="menu-bar">

        <div className="menu-item active">HOME</div>
        <div className="menu-item">CRICKET</div>
        <div className="menu-item">TENNIS</div>
        <div className="menu-item">FOOTBALL</div>
        <div className="menu-item">LOTTERY</div>
        <div className="menu-item">BACCARAT</div>
        <div className="menu-item">32 CARDS</div>
        <div className="menu-item">TEENPATTI</div>
        <div className="menu-item">POKER</div>
        <div className="menu-item">LUCKY 7</div>
        <div className="menu-item">MINES</div>
        <div className="menu-item">PENGUIN RUSH</div>

        {/* RED ICON */}
        <div className="rocket-icon">
          🚀
        </div>

      </div>
    </>
  );
};

export default Header;