import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/images/logo2.png";
import "./SBHeader.css";

const navLinks = [
  { label: "Home",         val: "all" },
  { label: "In-Play",      val: "inplay" },
  { label: "Cricket",      val: "Cricket" },
  { label: "Football",     val: "Football" },
  { label: "Tennis",       val: "Tennis" },
  { label: "Casino",       val: "Casino" },
  { label: "Slots",        val: "Slots" },
  { label: "Horse Racing", val: "Horse Racing" },
  { label: "Live Casino",  val: "Live Casino" },
];

const SBHeader = ({ onMenu, onFilter, activeFilter }) => {
  const navigate = useNavigate();

  return (
    <div className="sbh-root">

      {/* TOP GREEN STRIP */}
      <div className="sbh-strip">
        <div className="sbh-strip-links">
          {navLinks.map((n) => (
            <button
              key={n.val}
              className={`sbh-nav-btn ${activeFilter === n.val ? "sbh-nav-btn-active" : ""}`}
              onClick={() => onFilter(n.val)}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div className="sbh-strip-right">
          <button className="sbh-nav-btn" onClick={() => navigate("/")}>Rules</button>
          <button className="sbh-nav-btn" onClick={() => navigate("/")}>Support</button>
          <button className="sbh-nav-btn" onClick={() => navigate("/")}>FAQ</button>
        </div>
      </div>

      {/* MAIN HEADER BAR */}
      <div className="sbh-main">
        <div className="sbh-left">
          <button className="sbh-menu-btn" onClick={onMenu}><FaBars /></button>
          <div className="sbh-logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="logo" className="sbh-logo-img" />
          </div>
        </div>

        <div className="sbh-marquee">
          <span className="sbh-marquee-label">UPCOMING :</span>
          <div className="sbh-marquee-track">
            <span>
              ⚪ Gujarat Titans v Rajasthan Royals &nbsp;|&nbsp; 29/05 7:30 PM &nbsp;&nbsp;&nbsp;&nbsp;
              ⚪ Djokovic v Alcaraz &nbsp;|&nbsp; 29/05 6:00 PM &nbsp;&nbsp;&nbsp;&nbsp;
              ⚪ Man City v Arsenal &nbsp;|&nbsp; 30/05 9:00 PM &nbsp;&nbsp;&nbsp;&nbsp;
              ⚪ India v England Test &nbsp;|&nbsp; 30/05 10:00 AM &nbsp;&nbsp;&nbsp;&nbsp;
              ⚪ Real Madrid v Barcelona &nbsp;|&nbsp; 31/05 11:30 PM
            </span>
          </div>
        </div>

        <div className="sbh-right">
          <div className="sbh-balance-box">
            <span className="sbh-bal-label">Balance:</span>
            <span className="sbh-bal-amt">₹ 25,430.00</span>
          </div>
          <div className="sbh-balance-box">
            <span className="sbh-bal-label">Exposure:</span>
            <span className="sbh-bal-exp">₹ 0.00</span>
          </div>
          <button className="sbh-dep-btn" onClick={() => navigate("/deposit")}>Deposit</button>
          <button className="sbh-logout-btn" onClick={() => navigate("/")}>Logout</button>
        </div>
      </div>

    </div>
  );
};

export default SBHeader;
