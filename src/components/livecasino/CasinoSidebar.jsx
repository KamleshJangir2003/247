import React, { useState } from "react";
import "./CasinoSidebar.css";

const categories = [
  "All Games",
  "Roulette",
  "Teen Patti",
  "Poker",
  "Baccarat",
  "Dragon Tiger",
  "32 Cards",
  "Andar Bahar",
  "Lucky 7",
  "3 Card",
  "Casino War",
  "Bollywood",
  "VIP Casino",
  "Virtual Casino",
];

const CasinoSidebar = ({ onSelect }) => {
  const [active, setActive] = useState("All Games");

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
