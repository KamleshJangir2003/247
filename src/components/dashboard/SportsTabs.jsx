import React, { useState } from "react";
import { GiCricketBat, GiTennisBall } from "react-icons/gi";
import { FaFootballBall, FaHorse, FaDog, FaFire, FaStar } from "react-icons/fa";
import "./SportsTabs.css";

const tabs = [
  { id: "all", label: "All Sports", icon: <FaStar /> },
  { id: "inplay", label: "In-Play", icon: <FaFire />, live: true },
  { id: "cricket", label: "Cricket", icon: <GiCricketBat /> },
  { id: "football", label: "Football", icon: <FaFootballBall /> },
  { id: "tennis", label: "Tennis", icon: <GiTennisBall /> },
  { id: "horse", label: "Horse Racing", icon: <FaHorse /> },
  { id: "grey", label: "Greyhound", icon: <FaDog /> },
];

const SportsTabs = ({ onTabChange }) => {
  const [active, setActive] = useState("all");

  const handleTab = (id) => {
    setActive(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <div className="st-root">
      <div className="st-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`st-tab ${active === t.id ? "st-tab--active" : ""}`}
            onClick={() => handleTab(t.id)}
          >
            <span className="st-tab-icon">{t.icon}</span>
            <span className="st-tab-label">{t.label}</span>
            {t.live && <span className="st-live-badge">LIVE</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportsTabs;
