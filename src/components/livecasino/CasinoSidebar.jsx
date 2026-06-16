import React, { useState } from "react";
import "./CasinoSidebar.css";

const categories = ["Our Casino", "Virtual Casino", "Teenpatti", "Tembo", "VIP Casino"];

const CasinoSidebar = ({ onSelect }) => {
  const [active, setActive] = useState("Our Casino");

  const handleClick = (cat) => {
    setActive(cat);
    if (onSelect) onSelect(cat);
  };

  return (
    <div className="casino-sidebar">
      <div className="sidebar-title">Casino</div>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`sidebar-btn${active === cat ? " active" : ""}`}
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CasinoSidebar;
