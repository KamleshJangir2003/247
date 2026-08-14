import React, { useState } from "react";
import "./LiveCasinoPage.css";
import CasinoHeader from "../../components/livecasino/CasinoHeader";
import CasinoSidebar from "../../components/livecasino/CasinoSidebar";
import CasinoGrid from "../../components/livecasino/CasinoGrid";

const LiveCasinoPage = () => {
  const [category, setCategory] = useState("All Games");

  return (
    <div className="live-casino-page">
      <CasinoHeader />
      <div className="live-casino-body">
        <CasinoSidebar onSelect={setCategory} />
        <CasinoGrid category={category} />
      </div>
    </div>
  );
};

export default LiveCasinoPage;
