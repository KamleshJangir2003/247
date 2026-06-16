import React, { useState } from "react";
import "./CasinoGrid.css";
import CasinoCard from "./CasinoCard";
import GameModal from "./GameModal";
import { liveCasinoGames } from "../../data/gamesData";

const CasinoGrid = ({ category }) => {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="casino-grid-wrapper">
      <div className="casino-grid-title">
        {category || "Our Casino"} — Live Games
      </div>
      <div className="casino-grid">
        {liveCasinoGames.map((game) => (
          <CasinoCard
            key={game.id}
            name={game.name}
            img={game.img}
            badge={game.badge}
            onClick={() => setActiveGame(game)}
          />
        ))}
      </div>

      {activeGame && (
        <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
};

export default CasinoGrid;
