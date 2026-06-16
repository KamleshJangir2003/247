import React, { useState } from "react";
import { FaCircle, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./MatchTable.css";

const matches = [
  {
    id: 1,
    sport: "Cricket",
    league: "IPL 2025",
    team1: "Gujarat Titans",
    team2: "Rajasthan Royals",
    time: "Today 7:30 PM",
    live: true,
    score: "GT: 142/4 (16.2)",
    back1: [{ odds: "1.95", size: "12.4K" }, { odds: "2.02", size: "8.2K" }, { odds: "2.10", size: "5.1K" }],
    lay1:  [{ odds: "1.97", size: "9.8K" }, { odds: "2.04", size: "6.3K" }, { odds: "2.12", size: "3.2K" }],
    back2: [{ odds: "2.05", size: "10.1K" }, { odds: "2.12", size: "7.4K" }, { odds: "2.20", size: "4.8K" }],
    lay2:  [{ odds: "2.08", size: "8.5K" }, { odds: "2.15", size: "5.9K" }, { odds: "2.22", size: "2.7K" }],
  },
  {
    id: 2,
    sport: "Cricket",
    league: "IPL 2025",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    time: "Today 3:30 PM",
    live: true,
    score: "MI: 89/3 (11.0)",
    back1: [{ odds: "1.72", size: "22.1K" }, { odds: "1.78", size: "15.3K" }, { odds: "1.85", size: "9.2K" }],
    lay1:  [{ odds: "1.74", size: "18.4K" }, { odds: "1.80", size: "12.1K" }, { odds: "1.87", size: "6.8K" }],
    back2: [{ odds: "2.28", size: "18.7K" }, { odds: "2.35", size: "11.2K" }, { odds: "2.42", size: "7.1K" }],
    lay2:  [{ odds: "2.30", size: "15.2K" }, { odds: "2.38", size: "9.4K" }, { odds: "2.45", size: "4.3K" }],
  },
  {
    id: 3,
    sport: "Tennis",
    league: "Wimbledon 2025",
    team1: "N. Djokovic",
    team2: "C. Alcaraz",
    time: "Today 6:00 PM",
    live: true,
    score: "Djokovic leads 6-4, 3-2",
    back1: [{ odds: "1.45", size: "45.2K" }, { odds: "1.48", size: "32.1K" }, { odds: "1.52", size: "18.4K" }],
    lay1:  [{ odds: "1.46", size: "38.7K" }, { odds: "1.50", size: "27.3K" }, { odds: "1.54", size: "14.2K" }],
    back2: [{ odds: "2.90", size: "38.4K" }, { odds: "2.98", size: "24.7K" }, { odds: "3.05", size: "15.3K" }],
    lay2:  [{ odds: "2.94", size: "31.2K" }, { odds: "3.02", size: "20.1K" }, { odds: "3.10", size: "11.8K" }],
  },
  {
    id: 4,
    sport: "Football",
    league: "Premier League",
    team1: "Manchester City",
    team2: "Arsenal",
    time: "Tomorrow 9:00 PM",
    live: false,
    score: null,
    back1: [{ odds: "2.10", size: "31.2K" }, { odds: "2.18", size: "22.4K" }, { odds: "2.25", size: "14.1K" }],
    lay1:  [{ odds: "2.12", size: "26.8K" }, { odds: "2.20", size: "18.7K" }, { odds: "2.28", size: "10.3K" }],
    back2: [{ odds: "3.50", size: "28.4K" }, { odds: "3.60", size: "19.2K" }, { odds: "3.70", size: "12.5K" }],
    lay2:  [{ odds: "3.55", size: "23.1K" }, { odds: "3.65", size: "15.8K" }, { odds: "3.75", size: "9.2K" }],
  },
  {
    id: 5,
    sport: "Football",
    league: "La Liga",
    team1: "Real Madrid",
    team2: "Barcelona",
    time: "Tomorrow 11:30 PM",
    live: false,
    score: null,
    back1: [{ odds: "2.40", size: "52.3K" }, { odds: "2.48", size: "38.1K" }, { odds: "2.55", size: "24.7K" }],
    lay1:  [{ odds: "2.42", size: "44.8K" }, { odds: "2.50", size: "31.4K" }, { odds: "2.58", size: "19.2K" }],
    back2: [{ odds: "3.10", size: "44.7K" }, { odds: "3.20", size: "31.5K" }, { odds: "3.30", size: "20.1K" }],
    lay2:  [{ odds: "3.15", size: "37.2K" }, { odds: "3.25", size: "25.8K" }, { odds: "3.35", size: "15.4K" }],
  },
  {
    id: 6,
    sport: "Cricket",
    league: "Test Series",
    team1: "India",
    team2: "England",
    time: "29 May 10:00 AM",
    live: false,
    score: null,
    back1: [{ odds: "1.62", size: "67.4K" }, { odds: "1.68", size: "48.2K" }, { odds: "1.74", size: "31.5K" }],
    lay1:  [{ odds: "1.64", size: "58.1K" }, { odds: "1.70", size: "40.7K" }, { odds: "1.76", size: "25.3K" }],
    back2: [{ odds: "2.50", size: "58.2K" }, { odds: "2.60", size: "41.3K" }, { odds: "2.70", size: "27.8K" }],
    lay2:  [{ odds: "2.55", size: "49.4K" }, { odds: "2.65", size: "34.2K" }, { odds: "2.75", size: "21.1K" }],
  },
];

const OddsBtn = ({ odds, size, type }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <button
      className={`mt-odds-btn mt-odds-btn--${type} ${clicked ? "mt-odds-btn--clicked" : ""}`}
      onClick={handleClick}
    >
      <span className="mt-odds-val">{odds}</span>
      <span className="mt-odds-size">{size}</span>
    </button>
  );
};

const MatchRow = ({ match }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className={`mt-row ${match.live ? "mt-row--live" : ""}`}>
        {/* MATCH INFO */}
        <div className="mt-info" onClick={() => setExpanded(!expanded)}>
          <div className="mt-info-top">
            {match.live && (
              <span className="mt-live-tag">
                <FaCircle className="mt-live-dot" /> LIVE
              </span>
            )}
            <span className="mt-league">{match.league}</span>
            <span className="mt-time">{match.time}</span>
          </div>
          <div className="mt-teams">
            <span className="mt-team">{match.team1}</span>
            <span className="mt-vs">v</span>
            <span className="mt-team">{match.team2}</span>
          </div>
          {match.score && <div className="mt-score">{match.score}</div>}
          <button className="mt-expand-btn">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* ODDS GRID */}
        <div className="mt-odds-grid">
          {/* TEAM 1 ODDS */}
          <div className="mt-odds-group">
            <div className="mt-odds-label">{match.team1.split(" ")[0]}</div>
            <div className="mt-odds-row">
              {match.back1.slice(0, 1).map((o, i) => (
                <OddsBtn key={i} odds={o.odds} size={o.size} type="back" />
              ))}
              {match.lay1.slice(0, 1).map((o, i) => (
                <OddsBtn key={i} odds={o.odds} size={o.size} type="lay" />
              ))}
            </div>
          </div>

          {/* DRAW (hidden on mobile) */}
          <div className="mt-odds-group mt-odds-group--draw">
            <div className="mt-odds-label">Draw</div>
            <div className="mt-odds-row">
              <button className="mt-odds-btn mt-odds-btn--back mt-odds-btn--locked">
                <FaLock />
              </button>
              <button className="mt-odds-btn mt-odds-btn--lay mt-odds-btn--locked">
                <FaLock />
              </button>
            </div>
          </div>

          {/* TEAM 2 ODDS */}
          <div className="mt-odds-group">
            <div className="mt-odds-label">{match.team2.split(" ")[0]}</div>
            <div className="mt-odds-row">
              {match.back2.slice(0, 1).map((o, i) => (
                <OddsBtn key={i} odds={o.odds} size={o.size} type="back" />
              ))}
              {match.lay2.slice(0, 1).map((o, i) => (
                <OddsBtn key={i} odds={o.odds} size={o.size} type="lay" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDED FULL ODDS */}
      {expanded && (
        <div className="mt-expanded">
          <div className="mt-exp-header">
            <span>Full Odds — {match.team1} vs {match.team2}</span>
          </div>
          <div className="mt-exp-grid">
            {/* TEAM 1 */}
            <div className="mt-exp-col">
              <div className="mt-exp-col-title">{match.team1}</div>
              <div className="mt-exp-labels">
                <span className="mt-exp-back-label">Back</span>
                <span className="mt-exp-lay-label">Lay</span>
              </div>
              <div className="mt-exp-odds-row">
                {match.back1.map((o, i) => (
                  <OddsBtn key={i} odds={o.odds} size={o.size} type="back" />
                ))}
                {match.lay1.map((o, i) => (
                  <OddsBtn key={i} odds={o.odds} size={o.size} type="lay" />
                ))}
              </div>
            </div>
            {/* TEAM 2 */}
            <div className="mt-exp-col">
              <div className="mt-exp-col-title">{match.team2}</div>
              <div className="mt-exp-labels">
                <span className="mt-exp-back-label">Back</span>
                <span className="mt-exp-lay-label">Lay</span>
              </div>
              <div className="mt-exp-odds-row">
                {match.back2.map((o, i) => (
                  <OddsBtn key={i} odds={o.odds} size={o.size} type="back" />
                ))}
                {match.lay2.map((o, i) => (
                  <OddsBtn key={i} odds={o.odds} size={o.size} type="lay" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MatchTable = () => {
  return (
    <div className="mt-root">
      {/* TABLE HEADER */}
      <div className="mt-header">
        <div className="mt-header-left">
          <span className="mt-header-title">Live & Upcoming Events</span>
          <span className="mt-header-count">{matches.length} Events</span>
        </div>
        <div className="mt-header-right">
          <span className="mt-header-col mt-header-col--back">Back</span>
          <span className="mt-header-col mt-header-col--lay">Lay</span>
        </div>
      </div>

      {/* MATCH ROWS */}
      <div className="mt-list">
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
};

export default MatchTable;
