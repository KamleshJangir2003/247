import React from "react";
import { FaTrophy, FaDice, FaGift, FaStar, FaFire } from "react-icons/fa";
import "./RightSidebar.css";

const winners = [
  { user: "km****1851", game: "Roulette", amount: "₹3,15,41,739", time: "19:33" },
  { user: "ra****2247", game: "Aviator", amount: "₹1,82,34,500", time: "19:28" },
  { user: "su****9934", game: "Blackjack", amount: "₹98,72,100", time: "19:21" },
  { user: "vi****5512", game: "Baccarat", amount: "₹74,50,000", time: "19:15" },
  { user: "pr****7781", game: "Dragon Tiger", amount: "₹52,18,900", time: "19:08" },
];

const casinoGames = [
  { name: "Aviator", emoji: "✈️", tag: "HOT", tagColor: "#f56565" },
  { name: "Roulette", emoji: "🎡", tag: "LIVE", tagColor: "#00e676" },
  { name: "Blackjack", emoji: "🃏", tag: "NEW", tagColor: "#63b3ed" },
  { name: "Baccarat", emoji: "🎴", tag: "LIVE", tagColor: "#00e676" },
  { name: "Dragon Tiger", emoji: "🐉", tag: "HOT", tagColor: "#f56565" },
  { name: "Teen Patti", emoji: "🎲", tag: "NEW", tagColor: "#63b3ed" },
];

const RightSidebar = () => {
  return (
    <div className="rs-root">

      {/* WINNERS PANEL */}
      <div className="rs-section">
        <div className="rs-section-title">
          <FaTrophy className="rs-title-icon rs-title-icon--gold" />
          Top Winners
        </div>
        <div className="rs-winners">
          {winners.map((w, i) => (
            <div className="rs-winner-card" key={i}>
              <div className="rs-winner-rank">#{i + 1}</div>
              <div className="rs-winner-info">
                <div className="rs-winner-user">{w.user}</div>
                <div className="rs-winner-game">{w.game} • {w.time}</div>
              </div>
              <div className="rs-winner-amount">{w.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BONUS CARD */}
      <div className="rs-bonus">
        <div className="rs-bonus-icon"><FaGift /></div>
        <div className="rs-bonus-content">
          <div className="rs-bonus-title">Welcome Bonus</div>
          <div className="rs-bonus-amount">100% up to ₹10,000</div>
          <button className="rs-bonus-btn">Claim Now</button>
        </div>
      </div>

      {/* CASINO GAMES */}
      <div className="rs-section">
        <div className="rs-section-title">
          <FaDice className="rs-title-icon rs-title-icon--purple" />
          Casino Games
        </div>
        <div className="rs-casino-grid">
          {casinoGames.map((g, i) => (
            <div className="rs-casino-card" key={i}>
              <div className="rs-casino-emoji">{g.emoji}</div>
              <div className="rs-casino-name">{g.name}</div>
              <span className="rs-casino-tag" style={{ background: g.tagColor }}>{g.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING */}
      <div className="rs-section">
        <div className="rs-section-title">
          <FaFire className="rs-title-icon rs-title-icon--red" />
          Trending Bets
        </div>
        <div className="rs-trending">
          {["India to win Test Series", "Djokovic Wimbledon Winner", "Man City Top 4", "GT IPL Champions"].map((t, i) => (
            <div className="rs-trend-item" key={i}>
              <FaStar className="rs-trend-star" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;
