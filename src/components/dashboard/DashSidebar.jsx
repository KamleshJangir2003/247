import React, { useState } from "react";
import {
  FaFootballBall, FaHorse, FaDog, FaTableTennis,
  FaBasketballBall, FaDice, FaTv, FaChevronDown,
  FaChevronRight, FaTimes, FaFire, FaStar, FaGamepad,
  FaBaseballBall, FaVolleyballBall
} from "react-icons/fa";
import { GiCricketBat, GiTennisBall, GiBoxingGlove } from "react-icons/gi";
import "./DashSidebar.css";

const sports = [
  { icon: <FaFire />, label: "In-Play", count: 24, hot: true },
  { icon: <GiCricketBat />, label: "Cricket", count: 8 },
  { icon: <FaFootballBall />, label: "Football", count: 15 },
  { icon: <GiTennisBall />, label: "Tennis", count: 12 },
  { icon: <FaHorse />, label: "Horse Racing", count: 6 },
  { icon: <FaDog />, label: "Greyhound Racing", count: 4 },
  { icon: <FaBasketballBall />, label: "Basketball", count: 9 },
  { icon: <FaTableTennis />, label: "Table Tennis", count: 7 },
  { icon: <FaVolleyballBall />, label: "Volleyball", count: 3 },
  { icon: <GiBoxingGlove />, label: "Boxing", count: 2 },
  { icon: <FaBaseballBall />, label: "Kabaddi", count: 5 },
];

const casinoItems = [
  { icon: <FaDice />, label: "Live Casino" },
  { icon: <FaGamepad />, label: "Slot Games" },
  { icon: <FaTv />, label: "Virtual Sports" },
  { icon: <FaStar />, label: "Our Casino" },
];

const DashSidebar = ({ onClose }) => {
  const [sportsOpen, setSportsOpen] = useState(true);
  const [casinoOpen, setCasinoOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("In-Play");

  return (
    <div className="ds-root">
      {/* CLOSE BTN (mobile) */}
      <button className="ds-close" onClick={onClose}><FaTimes /></button>

      {/* SPORTS SECTION */}
      <div className="ds-section-header" onClick={() => setSportsOpen(!sportsOpen)}>
        <span>SPORTS</span>
        {sportsOpen ? <FaChevronDown /> : <FaChevronRight />}
      </div>

      {sportsOpen && (
        <div className="ds-items">
          {sports.map((s) => (
            <div
              key={s.label}
              className={`ds-item ${activeItem === s.label ? "ds-item--active" : ""}`}
              onClick={() => setActiveItem(s.label)}
            >
              <span className="ds-item-icon">{s.icon}</span>
              <span className="ds-item-label">{s.label}</span>
              {s.hot && <span className="ds-badge ds-badge--live">LIVE</span>}
              {!s.hot && <span className="ds-count">{s.count}</span>}
            </div>
          ))}
        </div>
      )}

      <div className="ds-divider" />

      {/* CASINO SECTION */}
      <div className="ds-section-header" onClick={() => setCasinoOpen(!casinoOpen)}>
        <span>CASINO</span>
        {casinoOpen ? <FaChevronDown /> : <FaChevronRight />}
      </div>

      {casinoOpen && (
        <div className="ds-items">
          {casinoItems.map((c) => (
            <div
              key={c.label}
              className={`ds-item ${activeItem === c.label ? "ds-item--active" : ""}`}
              onClick={() => setActiveItem(c.label)}
            >
              <span className="ds-item-icon">{c.icon}</span>
              <span className="ds-item-label">{c.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* PROMO BANNER */}
      <div className="ds-promo">
        <div className="ds-promo-title">🎁 Welcome Bonus</div>
        <div className="ds-promo-text">Get 100% up to ₹10,000</div>
        <button className="ds-promo-btn">Claim Now</button>
      </div>
    </div>
  );
};

export default DashSidebar;
