import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./CasinoHeader.css";

const navItems = [
  { label: "Lottery",       path: "/lottery" },
  { label: "Sportsbook1",   path: "/sportsbook1" },
  { label: "Exchange",      path: "/exchange" },
  { label: "Live Casino",   path: "/live-casino" },
  { label: "Slot",          path: "/slot" },
  { label: "Fantasy Games", path: "/fantasy-games" },
];

const CasinoHeader = () => {
  const location = useLocation();

  return (
    <div className="casino-header">
      <div className="casino-header-top">
        <div className="live-dot" />
        <span className="live-label">LIVE</span>
        <span className="casino-label">CASINO</span>
      </div>
      <nav className="casino-nav">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`casino-nav-item${location.pathname === item.path ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CasinoHeader;
