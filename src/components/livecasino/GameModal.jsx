import React, { useEffect } from "react";
import "./GameModal.css";

const GameModal = ({ game, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!game) return null;

  return (
    <div className="gmodal-backdrop" onClick={onClose}>
      <div className="gmodal-box" onClick={(e) => e.stopPropagation()}>

        {/* TOP BAR — game name + close */}
        <div className="gmodal-topbar">
          <div className="gmodal-topbar-left">
            <span className="gmodal-name">{game.name}</span>
            {game.badge && <span className="gmodal-badge">{game.badge}</span>}
          </div>
          <button className="gmodal-close" onClick={onClose}>✕</button>
        </div>

        {/* GAME AREA — full image shown clearly, iframe when API ready */}
        <div className="gmodal-img-wrap">
          {game.gameUrl ? (
            <iframe
              src={game.gameUrl}
              className="gmodal-iframe"
              title={game.name}
              allowFullScreen
            />
          ) : (
            <img src={game.img} alt={game.name} />
          )}
        </div>

        {/* BOTTOM BAR — note + play button */}
        <div className="gmodal-bottom">
          <span className="gmodal-api-note">🎮 {game.name}</span>
          <button
            className="gmodal-play-btn"
            onClick={() => window.open(game.gameUrl, "_blank")}
          >
            ⛶ Full Screen
          </button>
        </div>

      </div>
    </div>
  );
};

export default GameModal;
