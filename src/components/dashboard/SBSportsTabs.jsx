import React from "react";
import "./SBSportsTabs.css";

const tabs = [
  { label: "All Sports",   val: "all" },
  { label: "🔴 In-Play",  val: "inplay" },
  { label: "🏏 Cricket",  val: "Cricket" },
  { label: "⚽ Football", val: "Football" },
  { label: "🎾 Tennis",   val: "Tennis" },
  { label: "🏇 Horse Racing", val: "Horse Racing" },
  { label: "🐕 Greyhound",    val: "Greyhound Racing" },
  { label: "🎰 Casino",   val: "Casino" },
  { label: "🎮 Slots",    val: "Slots" },
];

const SBSportsTabs = ({ onFilter, activeFilter }) => (
  <div className="sbst-root">
    <div className="sbst-inner">
      {tabs.map(t => (
        <button
          key={t.val}
          className={`sbst-tab ${activeFilter === t.val ? "sbst-tab-active" : ""}`}
          onClick={() => onFilter(t.val)}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

export default SBSportsTabs;
