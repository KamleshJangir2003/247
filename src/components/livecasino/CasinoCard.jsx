import React from "react";
import "./CasinoCard.css";

const CasinoCard = ({ name, img, badge, onClick }) => (
  <div className="casino-card" onClick={onClick}>
    <img src={img} alt={name} className="casino-card-img" />
    {badge && <span className="casino-card-badge">{badge}</span>}
    <div className="casino-card-overlay">
      <div className="casino-card-name">{name}</div>
      <div className="casino-card-play">▶ PLAY</div>
    </div>
  </div>
);

export default CasinoCard;
