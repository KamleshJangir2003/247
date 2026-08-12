import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GameModal.css";

const GameModal = ({ game, onClose }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isDemo     = localStorage.getItem("userType") === "demo";

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!game) return null;

  const img = game.image || game.img;

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="gmodal-coming-soon">
          <img src={img} alt={game.name} className="gmodal-coming-bg" />
          <div className="gmodal-coming-overlay">
            <div className="gmodal-coming-icon">🔒</div>
            <div className="gmodal-coming-title">{game.name}</div>
            <div className="gmodal-coming-text">Login karein to play</div>
            <button className="gmodal-login-btn" onClick={() => { onClose(); navigate("/"); }}>Login Now</button>
            <button className="gmodal-register-btn" onClick={() => { onClose(); navigate("/register"); }}>Register Now</button>
          </div>
        </div>
      );
    }
    if (isDemo) {
      return (
        <div className="gmodal-coming-soon">
          <img src={img} alt={game.name} className="gmodal-coming-bg" />
          <div className="gmodal-coming-overlay">
            <div className="gmodal-coming-icon">👁️</div>
            <div className="gmodal-coming-title">{game.name}</div>
            <div className="gmodal-coming-text">Demo Mode — View Only</div>
            <div className="gmodal-coming-badge">Game khelne ke liye Real Account se Login karein</div>
            <button className="gmodal-login-btn" onClick={() => { onClose(); navigate("/"); }}>Real Account Login</button>
          </div>
        </div>
      );
    }
    if (game.gameUrl) {
      return (
        <iframe src={game.gameUrl} className="gmodal-iframe" title={game.name} allowFullScreen />
      );
    }
    return (
      <div className="gmodal-coming-soon">
        <img src={img} alt={game.name} className="gmodal-coming-bg" />
        <div className="gmodal-coming-overlay">
          <div className="gmodal-coming-icon">🎮</div>
          <div className="gmodal-coming-title">{game.name}</div>
          <div className="gmodal-coming-text">Game API Coming Soon</div>
          <div className="gmodal-coming-badge">Admin Panel se API add karein</div>
        </div>
      </div>
    );
  };

  return (
    <div className="gmodal-backdrop" onClick={onClose}>
      <div className="gmodal-box" onClick={(e) => e.stopPropagation()}>
        <div className="gmodal-topbar">
          <div className="gmodal-topbar-left">
            <span className="gmodal-name">{game.name}</span>
            {game.badge && <span className="gmodal-badge">{game.badge}</span>}
            {isDemo && <span className="gmodal-demo-tag">DEMO</span>}
          </div>
          <button className="gmodal-close" onClick={onClose}>✕</button>
        </div>
        <div className="gmodal-img-wrap">{renderContent()}</div>
        <div className="gmodal-bottom">
          <span className="gmodal-api-note">🎮 {game.name}</span>
          {!isDemo && game.gameUrl && isLoggedIn && (
            <button className="gmodal-play-btn" onClick={() => window.open(game.gameUrl, "_blank")}>
              ⛶ Full Screen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;
