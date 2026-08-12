import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fantasyGames } from "../../data/gamesData";
import { fantasyProviders } from "../../data/providers";
import "../../components/gamepage/GamePage.css";
import "./FantasyGamesPage.css";

const CATS = ["All Fantasy", "Cricket", "Football", "Kabaddi", "Basketball", "Grand League"];

const FantasyGamesPage = () => {
  const navigate = useNavigate();

  const [activeCat,      setActiveCat]      = useState("All Fantasy");
  const [activeProvider, setActiveProvider] = useState("All Providers");
  const [filterPopular,  setFilterPopular]  = useState(false);
  const [filterNew,      setFilterNew]      = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [search,         setSearch]         = useState("");
  const [activeGame,     setActiveGame]     = useState(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isDemo     = localStorage.getItem("userType") === "demo";

  const filtered = useMemo(() => {
    let g = fantasyGames;
    if (activeCat !== "All Fantasy") g = g.filter((x) => x.subCategory === activeCat);
    if (activeProvider !== "All Providers") g = g.filter((x) => x.provider === activeProvider);
    if (filterPopular)  g = g.filter((x) => x.isPopular);
    if (filterNew)      g = g.filter((x) => x.isNew);
    if (filterFeatured) g = g.filter((x) => x.isFeatured);
    if (search.trim()) {
      const q = search.toLowerCase();
      g = g.filter((x) =>
        x.name.toLowerCase().includes(q) ||
        x.provider.toLowerCase().includes(q) ||
        x.subCategory.toLowerCase().includes(q) ||
        x.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return g;
  }, [activeCat, activeProvider, filterPopular, filterNew, filterFeatured, search]);

  const clearFilters = () => {
    setActiveCat("All Fantasy");
    setActiveProvider("All Providers");
    setFilterPopular(false);
    setFilterNew(false);
    setFilterFeatured(false);
    setSearch("");
  };

  const badgeClass = (b) => {
    if (!b) return "";
    const l = b.toLowerCase();
    if (l === "hot") return "hot";
    if (l === "new") return "new";
    return "live";
  };

  const getImg = (game) => game.image || game.img;

  const renderModal = () => {
    if (!activeGame) return null;
    const img = getImg(activeGame);

    const content = () => {
      if (!isLoggedIn) return (
        <div className="gpage-coming-soon">
          <img src={img} alt={activeGame.name} className="gpage-coming-bg" />
          <div className="gpage-coming-overlay">
            <div className="gpage-coming-icon">🔒</div>
            <div className="gpage-coming-title">{activeGame.name}</div>
            <div className="gpage-coming-text">Login karein to play</div>
            <button className="gpage-login-btn" onClick={() => { setActiveGame(null); navigate("/"); }}>Login Now</button>
            <button className="gpage-register-btn" onClick={() => { setActiveGame(null); navigate("/register"); }}>Register Now</button>
          </div>
        </div>
      );
      if (isDemo) return (
        <div className="gpage-coming-soon">
          <img src={img} alt={activeGame.name} className="gpage-coming-bg" />
          <div className="gpage-coming-overlay">
            <div className="gpage-coming-icon">👁️</div>
            <div className="gpage-coming-title">{activeGame.name}</div>
            <div className="gpage-coming-text">Demo Mode — View Only</div>
            <div className="gpage-coming-badge">Real Account se Login karein</div>
            <button className="gpage-login-btn" onClick={() => { setActiveGame(null); navigate("/"); }}>Real Account Login</button>
          </div>
        </div>
      );
      if (activeGame.gameUrl) return (
        <iframe src={activeGame.gameUrl} className="gpage-modal-iframe" title={activeGame.name} allowFullScreen />
      );
      return (
        <div className="gpage-coming-soon">
          <img src={img} alt={activeGame.name} className="gpage-coming-bg" />
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
          <div className="gpage-modal-imgwrap">{content()}</div>
          <div className="gpage-modal-bottom">
            <span className="gpage-modal-note">🎮 {activeGame.name} — {activeGame.provider}</span>
            {isLoggedIn && !isDemo && activeGame.gameUrl && (
              <button className="gpage-modal-playbtn" onClick={() => window.open(activeGame.gameUrl, "_blank")}>⛶ Full Screen</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="gpage-wrap">
      <div className="gpage-titlebar">
        <div className="gpage-titlebar-dot" />
        <span className="gpage-titlebar-text">Fantasy Games</span>
        <span className="gpage-titlebar-count">{filtered.length} / {fantasyGames.length} Games</span>
      </div>

      <div className="gpage-body">
        <aside className="gpage-sidebar">
          <div className="gpage-sidebar-title">Category</div>
          {CATS.map((cat) => (
            <button key={cat} className={`gpage-sidebar-btn${activeCat === cat ? " active" : ""}`} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}

          <div className="gpage-sidebar-title" style={{ marginTop: "12px" }}>Provider</div>
          {fantasyProviders.map((p) => (
            <button key={p} className={`gpage-sidebar-btn${activeProvider === p ? " active" : ""}`} onClick={() => setActiveProvider(p)}>{p}</button>
          ))}

          <div className="gpage-sidebar-title" style={{ marginTop: "12px" }}>Filters</div>
          <button className={`gpage-sidebar-btn${filterPopular ? " active" : ""}`} onClick={() => setFilterPopular(!filterPopular)}>⭐ Popular</button>
          <button className={`gpage-sidebar-btn${filterNew ? " active" : ""}`} onClick={() => setFilterNew(!filterNew)}>🆕 New</button>
          <button className={`gpage-sidebar-btn${filterFeatured ? " active" : ""}`} onClick={() => setFilterFeatured(!filterFeatured)}>🔥 Featured</button>

          <button className="fantasy-clear-btn" onClick={clearFilters}>✕ Clear Filters</button>
        </aside>

        <main className="gpage-main">
          <div className="fantasy-search-bar">
            <input
              className="fantasy-search-input"
              type="text"
              placeholder="Search fantasy games by name, provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="gpage-section-title">{activeCat} — Fantasy Games</div>

          {filtered.length === 0 ? (
            <div className="fantasy-empty">
              <div className="fantasy-empty-title">No games found</div>
              <div className="fantasy-empty-sub">Try another search or remove some filters.</div>
            </div>
          ) : (
            <div className="gpage-grid">
              {filtered.map((game) => (
                <div key={game.id} className="gpage-card" onClick={() => setActiveGame(game)}>
                  <img src={getImg(game)} alt={game.name} className="gpage-card-img" />
                  {game.badge && <span className={`gpage-card-badge ${badgeClass(game.badge)}`}>{game.badge}</span>}
                  <div className="gpage-card-overlay">
                    <div className="gpage-card-name">{game.name}</div>
                    <div className="gpage-card-play">▶ PLAY</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {renderModal()}
    </div>
  );
};

export default FantasyGamesPage;
