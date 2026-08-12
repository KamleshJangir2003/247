import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./GamePage.css";

const NAV = [
  { label: "Lottery",       path: "/lottery" },
  { label: "Sportsbook1",   path: "/sportsbook1" },
  { label: "Exchange",      path: "/exchange" },
  { label: "Live Casino",   path: "/live-casino" },
  { label: "Slot",          path: "/slot" },
  { label: "Fantasy Games", path: "/fantasy-games" },
];

const GamePage = ({ title, games, categories }) => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const [activeGame, setActiveGame] = useState(null);
  const [activeCat, setActiveCat]   = useState(categories?.[0] || "All");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isDemo     = localStorage.getItem("userType") === "demo";

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setActiveGame(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const badgeClass = (b) => {
    if (!b) return "";
    const l = b.toLowerCase();
    if (l === "hot") return "hot";
    if (l === "new") return "new";
    return "live";
  };

  const renderModalContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="gpage-coming-soon">
          <img src={activeGame.img} alt={activeGame.name} className="gpage-coming-bg" />
          <div className="gpage-coming-overlay">
            <div className="gpage-coming-icon">🔒</div>
            <div className="gpage-coming-title">{activeGame.name}</div>
            <div className="gpage-coming-text">Login karein to play</div>
            <button className="gpage-login-btn" onClick={() => { setActiveGame(null); navigate("/"); }}>Login Now</button>
            <button className="gpage-register-btn" onClick={() => { setActiveGame(null); navigate("/register"); }}>Register Now</button>
          </div>
        </div>
      );
    }
    if (isDemo) {
      return (
        <div className="gpage-coming-soon">
          <img src={activeGame.img} alt={activeGame.name} className="gpage-coming-bg" />
          <div className="gpage-coming-overlay">
            <div className="gpage-coming-icon">👁️</div>
            <div className="gpage-coming-title">{activeGame.name}</div>
            <div className="gpage-coming-text">Demo Mode — View Only</div>
            <div className="gpage-coming-badge">Game khelne ke liye Real Account se Login karein</div>
            <button className="gpage-login-btn" onClick={() => { setActiveGame(null); navigate("/"); }}>Real Account Login</button>
          </div>
        </div>
      );
    }
    if (activeGame.gameUrl) {
      return (
        <iframe src={activeGame.gameUrl} className="gpage-modal-iframe" title={activeGame.name} allowFullScreen />
      );
    }
    return (
      <div className="gpage-coming-soon">
        <img src={activeGame.img} alt={activeGame.name} className="gpage-coming-bg" />
        <div className="gpage-coming-overlay">
          <div className="gpage-coming-icon">🎮</div>
          <div className="gpage-coming-title">{activeGame.name}</div>
          <div className="gpage-coming-text">Game API Coming Soon</div>
          <div className="gpage-coming-badge">Admin Panel se API add karein</div>
        </div>
      </div>
    );
  };

  return (
    <div className="gpage-wrap">

      <nav className="gpage-topnav">
        {NAV.map((n) => (
          <Link key={n.path} to={n.path} className={location.pathname === n.path ? "gpage-active" : ""}>
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="gpage-titlebar">
        <div className="gpage-titlebar-dot" />
        <span className="gpage-titlebar-text">{title}</span>
        <span className="gpage-titlebar-count">{games.length} Games</span>
      </div>

      <div className="gpage-body">
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

        <main className="gpage-main">
          <div className="gpage-section-title">{activeCat} — {title}</div>
          <div className="gpage-grid">
            {games.map((game) => (
              <div key={game.id} className="gpage-card" onClick={() => setActiveGame(game)}>
                <img src={game.img} alt={game.name} className="gpage-card-img" />
                {game.badge && (
                  <span className={`gpage-card-badge ${badgeClass(game.badge)}`}>{game.badge}</span>
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

      {activeGame && (
        <div className="gpage-modal-backdrop" onClick={() => setActiveGame(null)}>
          <div className="gpage-modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="gpage-modal-topbar">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="gpage-modal-name">{activeGame.name}</span>
                {activeGame.badge && <span className="gpage-modal-badge">{activeGame.badge}</span>}
                {isDemo && <span className="gpage-demo-tag">DEMO</span>}
              </div>
              <button className="gpage-modal-close" onClick={() => setActiveGame(null)}>✕</button>
            </div>

            <div className="gpage-modal-imgwrap">
              {renderModalContent()}
            </div>

            <div className="gpage-modal-bottom">
              <span className="gpage-modal-note">🎮 {activeGame.name}</span>
              {isLoggedIn && !isDemo && activeGame.gameUrl && (
                <button className="gpage-modal-playbtn" onClick={() => window.open(activeGame.gameUrl, "_blank")}>
                  ⛶ Full Screen
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GamePage;
