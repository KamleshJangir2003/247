import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GamePage.css";

const NAV = [
  { label: "Lottery",       path: "/lottery" },
  { label: "Sportsbook1",   path: "/sportsbook1" },
  { label: "Exchange",      path: "/exchange" },
  { label: "Live Casino",   path: "/live-casino" },
  { label: "Slot",          path: "/slot" },
  { label: "Fantasy Games", path: "/fantasy-games" },
];

/**
 * GamePage — shared template
 * Props:
 *   title      : page heading string
 *   games      : array of { id, name, img, badge, gameUrl? }
 *   categories : array of sidebar button strings
 */
const GamePage = ({ title, games, categories }) => {
  const location = useLocation();
  const [activeGame, setActiveGame] = useState(null);
  const [activeCat, setActiveCat] = useState(categories?.[0] || "All");

  // close modal on ESC
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setActiveGame(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const badgeClass = (b) => {
    if (!b) return "";
    const l = b.toLowerCase();
    if (l === "hot")  return "hot";
    if (l === "new")  return "new";
    return "live";
  };

  return (
    <div className="gpage-wrap">

      {/* TOP NAV */}
      <nav className="gpage-topnav">
        {NAV.map((n) => (
          <Link
            key={n.path}
            to={n.path}
            className={location.pathname === n.path ? "gpage-active" : ""}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* TITLE BAR */}
      <div className="gpage-titlebar">
        <div className="gpage-titlebar-dot" />
        <span className="gpage-titlebar-text">{title}</span>
        <span className="gpage-titlebar-count">{games.length} Games</span>
      </div>

      <div className="gpage-body">

        {/* SIDEBAR */}
        <aside className="gpage-sidebar">
          <div className="gpage-sidebar-title">Category</div>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gpage-sidebar-btn${activeCat === cat ? " active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* MAIN GRID */}
        <main className="gpage-main">
          <div className="gpage-section-title">{activeCat} — {title}</div>
          <div className="gpage-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="gpage-card"
                onClick={() => setActiveGame(game)}
              >
                <img src={game.img} alt={game.name} className="gpage-card-img" />
                {game.badge && (
                  <span className={`gpage-card-badge ${badgeClass(game.badge)}`}>
                    {game.badge}
                  </span>
                )}
                <div className="gpage-card-overlay">
                  <div className="gpage-card-name">{game.name}</div>
                  <div className="gpage-card-play">▶ PLAY</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {activeGame && (
        <div className="gpage-modal-backdrop" onClick={() => setActiveGame(null)}>
          <div className="gpage-modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="gpage-modal-topbar">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="gpage-modal-name">{activeGame.name}</span>
                {activeGame.badge && (
                  <span className="gpage-modal-badge">{activeGame.badge}</span>
                )}
              </div>
              <button className="gpage-modal-close" onClick={() => setActiveGame(null)}>✕</button>
            </div>

            <div className="gpage-modal-imgwrap">
              {activeGame.gameUrl ? (
                <iframe
                  src={activeGame.gameUrl}
                  className="gpage-modal-iframe"
                  title={activeGame.name}
                  allowFullScreen
                />
              ) : (
                <img src={activeGame.img} alt={activeGame.name} />
              )}
            </div>

            <div className="gpage-modal-bottom">
              <span className="gpage-modal-note">
                🎮 {activeGame.name}
              </span>
              <button
                className="gpage-modal-playbtn"
                onClick={() => window.open(activeGame.gameUrl, "_blank")}
              >
                ⛶ Full Screen
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GamePage;
