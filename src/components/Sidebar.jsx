import React, { useState } from "react";
import "./sidebar.css";

const Sidebar = () => {

  const [racingOpen, setRacingOpen] = useState(true);
  const [othersOpen, setOthersOpen] = useState(true);
  const [sportsOpen, setSportsOpen] = useState(true);

  const racingSports = [
    "Horse Racing",
    "Greyhound Racing",
  ];

  const others = [
    "Our Casino",
    "Our Virtual",
    "Live Casino",
    "Slot Game",
  ];

  const allSports = [
    "Politics",
    "Cricket",
    "Football",
    "Tennis",
    "Table Tennis",
    "Badminton",
    "Esoccer",
    "Basketball",
    "Volleyball",
    "Snooker",
    "Ice Hockey",
    "E Games",
    "Futsal",
    "Handball",
    "Kabaddi",
    "Golf",
    "Rugby League",
    "Boxing",
    "Beach Volleyball",
    "Mixed Martial Arts",
  ];

  return (
    <div className="sidebar">

      {/* RACING SPORTS */}
      <div
        className="sidebar-title"
        onClick={() => setRacingOpen(!racingOpen)}
      >
        Racing Sports

        <span>
          {racingOpen ? "⌃" : "⌄"}
        </span>
      </div>

      {
        racingOpen &&
        racingSports.map((item, index) => (
          <div className="sidebar-item" key={index}>
            {item}
          </div>
        ))
      }

      {/* OTHERS */}
      <div
        className="sidebar-title"
        onClick={() => setOthersOpen(!othersOpen)}
      >
        Others

        <span>
          {othersOpen ? "⌃" : "⌄"}
        </span>
      </div>

      {
        othersOpen &&
        others.map((item, index) => (
          <div className="sidebar-item" key={index}>
            {item}
          </div>
        ))
      }

      {/* ALL SPORTS */}
      <div
        className="sidebar-title"
        onClick={() => setSportsOpen(!sportsOpen)}
      >
        All Sports

        <span>
          {sportsOpen ? "⌃" : "⌄"}
        </span>
      </div>

      {
        sportsOpen &&
        allSports.map((item, index) => (
          <div className="sidebar-item sports-item" key={index}>
            <span className="plus-icon">⊞</span>
            {item}
          </div>
        ))
      }

    </div>
  );
};

export default Sidebar;