import React, { useState } from "react";
import "./SBSidebar.css";

const sections = [
  {
    title: "IN-PLAY",
    key: "IN_PLAY",
    items: [
      { icon: "🏏", label: "Cricket",    val: "Cricket",      count: 8 },
      { icon: "⚽", label: "Football",   val: "Football",     count: 15 },
      { icon: "🎾", label: "Tennis",     val: "Tennis",       count: 12 },
      { icon: "🏀", label: "Basketball", val: "Basketball",   count: 6 },
    ],
  },
  {
    title: "SPORTS",
    key: "SPORTS",
    items: [
      { icon: "🏏", label: "Cricket",          val: "Cricket" },
      { icon: "⚽", label: "Football",         val: "Football" },
      { icon: "🎾", label: "Tennis",           val: "Tennis" },
      { icon: "🏇", label: "Horse Racing",     val: "Horse Racing" },
      { icon: "🐕", label: "Greyhound Racing", val: "Greyhound Racing" },
      { icon: "🏀", label: "Basketball",       val: "Basketball" },
      { icon: "🏓", label: "Table Tennis",     val: "Table Tennis" },
      { icon: "🏐", label: "Volleyball",       val: "Volleyball" },
      { icon: "🥊", label: "Boxing",           val: "Boxing" },
      { icon: "🏑", label: "Kabaddi",          val: "Kabaddi" },
      { icon: "🏒", label: "Ice Hockey",       val: "Ice Hockey" },
      { icon: "🎱", label: "Snooker",          val: "Snooker" },
      { icon: "🏉", label: "Rugby League",     val: "Rugby League" },
      { icon: "🤸", label: "Badminton",        val: "Badminton" },
      { icon: "🎮", label: "E-Games",          val: "E-Games" },
    ],
  },
  {
    title: "RACING",
    key: "RACING",
    items: [
      { icon: "🏇", label: "Horse Racing",     val: "Horse Racing" },
      { icon: "🐕", label: "Greyhound Racing", val: "Greyhound Racing" },
    ],
  },
  {
    title: "CASINO",
    key: "CASINO",
    items: [
      { icon: "🎰", label: "Our Casino",    val: "Casino" },
      { icon: "🃏", label: "Live Casino",   val: "Live Casino" },
      { icon: "🎲", label: "Slot Games",    val: "Slots" },
      { icon: "📺", label: "Virtual Sports",val: "Virtual Sports" },
    ],
  },
];

const SBSidebar = ({ onFilter, activeFilter }) => {
  const [open, setOpen] = useState({ IN_PLAY: true, SPORTS: true, RACING: false, CASINO: false });

  return (
    <div className="sbs-root">
      {sections.map((sec) => (
        <div key={sec.key}>
          <div className="sbs-sec-title" onClick={() => setOpen(p => ({ ...p, [sec.key]: !p[sec.key] }))}>
            <span>{sec.title}</span>
            <span className="sbs-arrow">{open[sec.key] ? "▲" : "▼"}</span>
          </div>
          {open[sec.key] && sec.items.map((item) => (
            <div
              key={item.val + item.label}
              className={`sbs-item ${activeFilter === item.val ? "sbs-item-active" : ""}`}
              onClick={() => onFilter(item.val)}
            >
              <span className="sbs-icon">{item.icon}</span>
              <span className="sbs-label">{item.label}</span>
              {item.count && <span className="sbs-count">{item.count}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SBSidebar;
