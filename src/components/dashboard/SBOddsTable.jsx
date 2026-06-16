import React, { useState } from "react";
import "./SBOddsTable.css";

const matches = [
  {
    id: 1, sport: "Cricket", league: "IPL 2025 • Match 68",
    team1: "Gujarat Titans", team2: "Rajasthan Royals",
    time: "Today 7:30 PM", live: true, score: "GT 142/4 (16.2)",
    t1back: ["1.95","2.02","2.10"], t1lay: ["1.97","2.04","2.12"],
    t2back: ["2.05","2.12","2.20"], t2lay: ["2.08","2.15","2.22"],
    t1sz: ["12.4K","8.2K","5.1K"], t1lsz: ["9.8K","6.3K","3.2K"],
    t2sz: ["10.1K","7.4K","4.8K"], t2lsz: ["8.5K","5.9K","2.7K"],
  },
  {
    id: 2, sport: "Cricket", league: "IPL 2025 • Match 67",
    team1: "Mumbai Indians", team2: "Chennai Super Kings",
    time: "Today 3:30 PM", live: true, score: "MI 89/3 (11.0)",
    t1back: ["1.72","1.78","1.85"], t1lay: ["1.74","1.80","1.87"],
    t2back: ["2.28","2.35","2.42"], t2lay: ["2.30","2.38","2.45"],
    t1sz: ["22.1K","15.3K","9.2K"], t1lsz: ["18.4K","12.1K","6.8K"],
    t2sz: ["18.7K","11.2K","7.1K"], t2lsz: ["15.2K","9.4K","4.3K"],
  },
  {
    id: 3, sport: "Tennis", league: "Wimbledon 2025 • Final",
    team1: "N. Djokovic", team2: "C. Alcaraz",
    time: "Today 6:00 PM", live: true, score: "Djokovic 6-4, 3-2",
    t1back: ["1.45","1.48","1.52"], t1lay: ["1.46","1.50","1.54"],
    t2back: ["2.90","2.98","3.05"], t2lay: ["2.94","3.02","3.10"],
    t1sz: ["45.2K","32.1K","18.4K"], t1lsz: ["38.7K","27.3K","14.2K"],
    t2sz: ["38.4K","24.7K","15.3K"], t2lsz: ["31.2K","20.1K","11.8K"],
  },
  {
    id: 4, sport: "Football", league: "Premier League • GW38",
    team1: "Manchester City", team2: "Arsenal",
    time: "Tomorrow 9:00 PM", live: false, score: null,
    t1back: ["2.10","2.18","2.25"], t1lay: ["2.12","2.20","2.28"],
    t2back: ["3.50","3.60","3.70"], t2lay: ["3.55","3.65","3.75"],
    t1sz: ["31.2K","22.4K","14.1K"], t1lsz: ["26.8K","18.7K","10.3K"],
    t2sz: ["28.4K","19.2K","12.5K"], t2lsz: ["23.1K","15.8K","9.2K"],
  },
  {
    id: 5, sport: "Football", league: "La Liga • GW38",
    team1: "Real Madrid", team2: "Barcelona",
    time: "Tomorrow 11:30 PM", live: false, score: null,
    t1back: ["2.40","2.48","2.55"], t1lay: ["2.42","2.50","2.58"],
    t2back: ["3.10","3.20","3.30"], t2lay: ["3.15","3.25","3.35"],
    t1sz: ["52.3K","38.1K","24.7K"], t1lsz: ["44.8K","31.4K","19.2K"],
    t2sz: ["44.7K","31.5K","20.1K"], t2lsz: ["37.2K","25.8K","15.4K"],
  },
  {
    id: 6, sport: "Cricket", league: "Test Series • 1st Test",
    team1: "India", team2: "England",
    time: "29 May 10:00 AM", live: false, score: null,
    t1back: ["1.62","1.68","1.74"], t1lay: ["1.64","1.70","1.76"],
    t2back: ["2.50","2.60","2.70"], t2lay: ["2.55","2.65","2.75"],
    t1sz: ["67.4K","48.2K","31.5K"], t1lsz: ["58.1K","40.7K","25.3K"],
    t2sz: ["58.2K","41.3K","27.8K"], t2lsz: ["49.4K","34.2K","21.1K"],
  },
  {
    id: 7, sport: "Horse Racing", league: "Ascot • Race 3",
    team1: "Thunderbolt", team2: "Silver Arrow",
    time: "Today 4:15 PM", live: false, score: null,
    t1back: ["3.20","3.40","3.60"], t1lay: ["3.25","3.45","3.65"],
    t2back: ["4.50","4.70","4.90"], t2lay: ["4.55","4.75","4.95"],
    t1sz: ["8.2K","5.4K","3.1K"], t1lsz: ["6.8K","4.2K","2.3K"],
    t2sz: ["7.1K","4.8K","2.9K"], t2lsz: ["5.9K","3.7K","1.8K"],
  },
  {
    id: 8, sport: "Horse Racing", league: "Cheltenham • Race 5",
    team1: "Golden Flash", team2: "Dark Knight",
    time: "Today 5:30 PM", live: false, score: null,
    t1back: ["2.80","3.00","3.20"], t1lay: ["2.85","3.05","3.25"],
    t2back: ["3.80","4.00","4.20"], t2lay: ["3.85","4.05","4.25"],
    t1sz: ["6.1K","4.2K","2.8K"], t1lsz: ["5.2K","3.4K","1.9K"],
    t2sz: ["5.8K","3.9K","2.4K"], t2lsz: ["4.7K","3.1K","1.6K"],
  },
];

const sportIcon = { Cricket: "🏏", Football: "⚽", Tennis: "🎾", "Horse Racing": "🏇" };

const OddsCell = ({ val, size, type }) => {
  const [flash, setFlash] = useState(false);
  const click = (e) => { e.stopPropagation(); setFlash(true); setTimeout(() => setFlash(false), 250); };
  return (
    <td className={`sbot-odds-cell sbot-${type} ${flash ? "sbot-flash" : ""}`} onClick={click}>
      <div className="sbot-odds-val">{val}</div>
      <div className="sbot-odds-size">{size}</div>
    </td>
  );
};

const SBOddsTable = ({ activeFilter }) => {
  const [expanded, setExpanded] = useState(null);

  // Filter logic
  const filtered = matches.filter(m => {
    if (activeFilter === "all")    return true;
    if (activeFilter === "inplay") return m.live;
    // Casino / Slots / Live Casino — no sports matches, show empty
    if (["Casino","Slots","Live Casino","Virtual Sports"].includes(activeFilter)) return false;
    return m.sport === activeFilter;
  });

  // Label for section header
  const filterLabel = activeFilter === "all" ? "LIVE & UPCOMING EVENTS"
    : activeFilter === "inplay" ? "IN-PLAY EVENTS"
    : activeFilter.toUpperCase() + " EVENTS";

  return (
    <div className="sbot-root">

      {/* SECTION HEADER */}
      <div className="sbot-sec-hdr">
        <span className="sbot-sec-title">
          {activeFilter === "inplay" ? "🔴" : activeFilter === "all" ? "🔴" : (sportIcon[activeFilter] || "🎯")} {filterLabel}
        </span>
        <span className="sbot-sec-count">{filtered.length} events</span>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="sbot-empty">
          <div className="sbot-empty-icon">
            {["Casino","Slots"].includes(activeFilter) ? "🎰" : activeFilter === "Live Casino" ? "🃏" : "📋"}
          </div>
          <div className="sbot-empty-text">
            {["Casino","Slots","Live Casino"].includes(activeFilter)
              ? "Casino games are available in the Casino section."
              : `No ${activeFilter} events available right now.`}
          </div>
          <div className="sbot-empty-sub">Check back soon or try another sport.</div>
        </div>
      )}

      {/* TABLE */}
      {filtered.length > 0 && (
        <table className="sbot-table">
          <thead>
            <tr className="sbot-thead-row">
              <th className="sbot-th-match">Match / Event</th>
              <th className="sbot-th-odds" colSpan={2}><span className="sbot-th-back">Back</span></th>
              <th className="sbot-th-odds" colSpan={2}><span className="sbot-th-lay">Lay</span></th>
              <th className="sbot-th-odds" colSpan={2}><span className="sbot-th-back">Back</span></th>
              <th className="sbot-th-odds" colSpan={2}><span className="sbot-th-lay">Lay</span></th>
            </tr>
            <tr className="sbot-thead-sub">
              <th className="sbot-th-match"></th>
              <th className="sbot-th-team" colSpan={4}>— Team 1 —</th>
              <th className="sbot-th-team" colSpan={4}>— Team 2 —</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <React.Fragment key={m.id}>
                {/* SPORT SEPARATOR */}
                {(idx === 0 || filtered[idx - 1].sport !== m.sport) && (
                  <tr className="sbot-sport-row">
                    <td colSpan={9} className="sbot-sport-cell">
                      {sportIcon[m.sport] || "🎯"} {m.sport.toUpperCase()}
                    </td>
                  </tr>
                )}

                {/* MATCH ROW */}
                <tr
                  className={`sbot-row ${m.live ? "sbot-row-live" : ""} ${idx % 2 === 0 ? "sbot-row-even" : "sbot-row-odd"}`}
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                >
                  <td className="sbot-td-match">
                    <div className="sbot-match-top">
                      {m.live && <span className="sbot-live-badge">● LIVE</span>}
                      <span className="sbot-league">{m.league}</span>
                      <span className="sbot-time">{m.time}</span>
                    </div>
                    <div className="sbot-teams">
                      <span className="sbot-team1">{m.team1}</span>
                      <span className="sbot-vs">v</span>
                      <span className="sbot-team2">{m.team2}</span>
                    </div>
                    {m.score && <div className="sbot-score">{m.score}</div>}
                  </td>
                  <OddsCell val={m.t1back[0]} size={m.t1sz[0]}   type="back" />
                  <OddsCell val={m.t1back[1]} size={m.t1sz[1]}   type="back2" />
                  <OddsCell val={m.t1lay[0]}  size={m.t1lsz[0]}  type="lay" />
                  <OddsCell val={m.t1lay[1]}  size={m.t1lsz[1]}  type="lay2" />
                  <OddsCell val={m.t2back[0]} size={m.t2sz[0]}   type="back" />
                  <OddsCell val={m.t2back[1]} size={m.t2sz[1]}   type="back2" />
                  <OddsCell val={m.t2lay[0]}  size={m.t2lsz[0]}  type="lay" />
                  <OddsCell val={m.t2lay[1]}  size={m.t2lsz[1]}  type="lay2" />
                </tr>

                {/* EXPANDED */}
                {expanded === m.id && (
                  <tr className="sbot-exp-row">
                    <td colSpan={9} className="sbot-exp-td">
                      <div className="sbot-exp-inner">
                        {[
                          { title: m.team1, back: m.t1back, lay: m.t1lay, bsz: m.t1sz, lsz: m.t1lsz },
                          { title: m.team2, back: m.t2back, lay: m.t2lay, bsz: m.t2sz, lsz: m.t2lsz },
                        ].map((col) => (
                          <div className="sbot-exp-col" key={col.title}>
                            <div className="sbot-exp-title">{col.title}</div>
                            <div className="sbot-exp-odds-row">
                              <div className="sbot-exp-group">
                                <div className="sbot-exp-lbl sbot-exp-lbl-back">Back</div>
                                {col.back.map((o, i) => (
                                  <div key={i} className="sbot-exp-cell sbot-exp-back">
                                    <div>{o}</div><div className="sbot-exp-sz">{col.bsz[i]}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="sbot-exp-group">
                                <div className="sbot-exp-lbl sbot-exp-lbl-lay">Lay</div>
                                {col.lay.map((o, i) => (
                                  <div key={i} className="sbot-exp-cell sbot-exp-lay">
                                    <div>{o}</div><div className="sbot-exp-sz">{col.lsz[i]}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SBOddsTable;
