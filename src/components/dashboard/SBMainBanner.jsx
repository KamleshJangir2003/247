import React, { useState, useEffect } from "react";
import "./SBMainBanner.css";

const banners = [
  {
    id: 1,
    bg: "#0a2a0a",
    accent: "#00cc44",
    tag: "LIVE NOW",
    sport: "🏏 IPL 2025",
    match: "Gujarat Titans vs Rajasthan Royals",
    info: "Today 7:30 PM  |  Narendra Modi Stadium",
    score: "GT: 142/4 (16.2 ov)  •  RR need 78 off 23 balls",
    btn1: "BET NOW",
    btn2: "VIEW ODDS",
  },
  {
    id: 2,
    bg: "#0a0a2a",
    accent: "#4488ff",
    tag: "FEATURED",
    sport: "🎾 Wimbledon 2025",
    match: "N. Djokovic vs C. Alcaraz",
    info: "Today 6:00 PM  |  Centre Court",
    score: "Djokovic leads 6-4, 3-2  •  Grand Slam Final",
    btn1: "BET NOW",
    btn2: "VIEW ODDS",
  },
  {
    id: 3,
    bg: "#1a0a0a",
    accent: "#ff6644",
    tag: "PREMIER LEAGUE",
    sport: "⚽ Premier League",
    match: "Manchester City vs Arsenal",
    info: "Tomorrow 9:00 PM  |  Etihad Stadium",
    score: "Title Decider  •  Best odds guaranteed",
    btn1: "BET NOW",
    btn2: "VIEW ODDS",
  },
  {
    id: 4,
    bg: "#1a1a0a",
    accent: "#f6c90e",
    tag: "WELCOME BONUS",
    sport: "🎁 Special Offer",
    match: "100% Welcome Bonus up to ₹10,000",
    info: "New members only  •  Min deposit ₹500",
    score: "Use code: WELCOME100  •  T&C apply",
    btn1: "CLAIM NOW",
    btn2: "LEARN MORE",
  },
];

const SBMainBanner = () => {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur(p => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[cur];

  return (
    <div className="sbb-root" style={{ background: b.bg }}>
      {/* SLIDE CONTENT */}
      <div className="sbb-content">
        <div className="sbb-left">
          <span className="sbb-tag" style={{ background: b.accent, color: b.accent === "#f6c90e" ? "#000" : "#fff" }}>
            {b.tag}
          </span>
          <div className="sbb-sport" style={{ color: b.accent }}>{b.sport}</div>
          <div className="sbb-match">{b.match}</div>
          <div className="sbb-info">{b.info}</div>
          <div className="sbb-score">{b.score}</div>
          <div className="sbb-btns">
            <button className="sbb-btn sbb-btn-main" style={{ background: b.accent, color: b.accent === "#f6c90e" ? "#000" : "#fff" }}>
              {b.btn1}
            </button>
            <button className="sbb-btn sbb-btn-sec">{b.btn2}</button>
          </div>
        </div>
        <div className="sbb-deco">
          <div className="sbb-deco-sport">{b.sport.split(" ")[0]}</div>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="sbb-controls">
        <button className="sbb-arrow" onClick={() => setCur(p => (p - 1 + banners.length) % banners.length)}>◀</button>
        <div className="sbb-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`sbb-dot ${i === cur ? "sbb-dot-active" : ""}`}
              onClick={() => setCur(i)}
            />
          ))}
        </div>
        <button className="sbb-arrow" onClick={() => setCur(p => (p + 1) % banners.length)}>▶</button>
      </div>
    </div>
  );
};

export default SBMainBanner;
