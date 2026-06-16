import React from "react";
import "./SBRightSidebar.css";

const winners = [
  { user: "km****1851", game: "Roulette",     amt: "₹3,15,41,739", time: "19:33" },
  { user: "ra****2247", game: "Aviator",      amt: "₹1,82,34,500", time: "19:28" },
  { user: "su****9934", game: "Blackjack",    amt: "₹98,72,100",   time: "19:21" },
  { user: "vi****5512", game: "Baccarat",     amt: "₹74,50,000",   time: "19:15" },
  { user: "pr****7781", game: "Dragon Tiger", amt: "₹52,18,900",   time: "19:08" },
  { user: "an****3312", game: "Teen Patti",   amt: "₹38,44,200",   time: "19:01" },
];

const casinoGames = [
  { emoji: "✈️", name: "Aviator",      tag: "HOT",  tagBg: "#cc0000" },
  { emoji: "🎡", name: "Roulette",     tag: "LIVE", tagBg: "#008b5b" },
  { emoji: "🃏", name: "Blackjack",    tag: "NEW",  tagBg: "#1a3a5c" },
  { emoji: "🎴", name: "Baccarat",     tag: "LIVE", tagBg: "#008b5b" },
  { emoji: "🐉", name: "Dragon Tiger", tag: "HOT",  tagBg: "#cc0000" },
  { emoji: "🎲", name: "Teen Patti",   tag: "NEW",  tagBg: "#1a3a5c" },
];

const SBRightSidebar = () => (
  <div className="sbrs-root">

    {/* WINNERS */}
    <div className="sbrs-sec-title">🏆 TOP WINNERS</div>
    <div className="sbrs-winners">
      {winners.map((w, i) => (
        <div className="sbrs-winner-row" key={i}>
          <span className="sbrs-rank">#{i + 1}</span>
          <div className="sbrs-winner-info">
            <div className="sbrs-winner-user">{w.user}</div>
            <div className="sbrs-winner-game">{w.game} • {w.time}</div>
          </div>
          <div className="sbrs-winner-amt">{w.amt}</div>
        </div>
      ))}
    </div>

    {/* BONUS BANNER */}
    <div className="sbrs-sec-title">🎁 BONUS</div>
    <div className="sbrs-bonus">
      <div className="sbrs-bonus-title">Welcome Bonus</div>
      <div className="sbrs-bonus-amt">100% up to ₹10,000</div>
      <div className="sbrs-bonus-code">Code: WELCOME100</div>
      <button className="sbrs-bonus-btn">CLAIM NOW</button>
    </div>

    {/* CASINO GAMES */}
    <div className="sbrs-sec-title">🎰 CASINO GAMES</div>
    <div className="sbrs-casino-grid">
      {casinoGames.map((g, i) => (
        <div className="sbrs-casino-card" key={i}>
          <div className="sbrs-casino-emoji">{g.emoji}</div>
          <div className="sbrs-casino-name">{g.name}</div>
          <span className="sbrs-casino-tag" style={{ background: g.tagBg }}>{g.tag}</span>
        </div>
      ))}
    </div>

    {/* TRENDING */}
    <div className="sbrs-sec-title">🔥 TRENDING</div>
    <div className="sbrs-trending">
      {[
        "India to win Test Series",
        "Djokovic Wimbledon Winner",
        "Man City Top 4 Finish",
        "GT IPL 2025 Champions",
        "Alcaraz French Open",
      ].map((t, i) => (
        <div className="sbrs-trend-item" key={i}>
          <span className="sbrs-trend-num">{i + 1}.</span>
          <span>{t}</span>
        </div>
      ))}
    </div>

  </div>
);

export default SBRightSidebar;
