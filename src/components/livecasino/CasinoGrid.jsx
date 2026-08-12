import React, { useState } from "react";
import "./CasinoGrid.css";
import CasinoCard from "./CasinoCard";
import GameModal from "./GameModal";
import { liveCasinoGames } from "../../data/gamesData";

const CasinoGrid = ({ category }) => {
  const [activeGame, setActiveGame] = useState(null);

  const filtered = category === "All Games" || !category
    ? liveCasinoGames
    : liveCasinoGames.filter((g) => g.subCategory === category);

  return (
    <div className="casino-grid-wrapper">
      <div className="casino-grid-title">
        {category || "All Games"} — Live Games
      </div>

      {filtered.length === 0 ? (
        <div className="casino-grid-empty">No games available in this category.</div>
      ) : (
        <div className="casino-grid">
          {filtered.map((game) => (
            <CasinoCard
              key={game.id}
              name={game.name}
              img={game.image || game.img}
              badge={game.badge}
              onClick={() => setActiveGame(game)}
            />
          ))}
        </div>
      )}

      {activeGame && (
        <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
};

export default CasinoGrid;
