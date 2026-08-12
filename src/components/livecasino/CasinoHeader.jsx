import React from "react";
import "./CasinoHeader.css";

const CasinoHeader = () => (
  <div className="casino-header">
    <div className="casino-header-top">
      <div className="live-dot" />
      <span className="live-label">LIVE</span>
      <span className="casino-label">CASINO</span>
    </div>
  </div>
);

export default CasinoHeader;
