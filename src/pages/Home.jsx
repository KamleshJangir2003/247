import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./home.css";

const Home = () => {

  const matches = [
    "Kolkata Knight Riders (e) - Rajasthan Royals (e)",
    "Punjab Kings (e) - Rajasthan Royals (e)",
    "Royal Challengers Bengaluru (e) - Delhi Capitals (e)",
    "Royal Challengers Bengaluru (e) - Gujarat Titans",
    "Royal Challengers Bengaluru (e) - Lucknow Super Giants (e)",
    "Indian Premier League",
    "Sydney Sixers XI v Adelaide Strikers XI",
    "Kolkata Knight Riders (e) - Royal Challengers Bengaluru (e)",
    "Royal Challengers Bengaluru (e) - Sunrisers Hyderabad (e)",
    "RC Bengaluru v Gujarat Titans",
    "Sunrisers Hyderabad v Rajasthan Royals",
    "Hampshire v Essex",
    "Leicestershire v Derbyshire",
    "Hampshire W v Essex W",
    "Somerset W v Yorkshire W",
    "Surrey W v Durham W",
    "Warwickshire W v The Blaze W",
  ];

  const casinoCards = [
    "https://i.imgur.com/qQZ6G6x.jpeg",
    "https://i.imgur.com/1uV7KXj.jpeg",
    "https://i.imgur.com/r9nXW1T.jpeg",
    "https://i.imgur.com/D7djv8G.jpeg",
    "https://i.imgur.com/7m8d0W6.jpeg",
    "https://i.imgur.com/o9M9GQf.jpeg",
    "https://i.imgur.com/vw0M5Xh.jpeg",
    "https://i.imgur.com/9vJYxjN.jpeg",
  ];

  return (
    <div className="home-page">

      <Header />

      <div className="main-layout">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="content-area">

          {/* TOP TABS */}
          <div className="sports-tabs">

            <div className="sports-tab active-tab">Cricket</div>
            <div className="sports-tab">Football</div>
            <div className="sports-tab">Tennis</div>
            <div className="sports-tab">Esoccer</div>
            <div className="sports-tab">Horse Racing</div>
            <div className="sports-tab">Greyhound Racing</div>
            <div className="sports-tab">Table Tennis</div>
            <div className="sports-tab">Basketball</div>
            <div className="sports-tab">Boxing</div>
            <div className="sports-tab">Mixed Martial Art</div>

          </div>

          {/* TABLE */}
          <div className="match-table">

            {/* TABLE HEADER */}
            <div className="table-header">

              <div className="game-col">
                Game
              </div>

              <div className="odds-header">
                <span>1</span>
                <span>X</span>
                <span>2</span>
              </div>

            </div>

            {/* MATCH ROWS */}
            {
              matches.map((match, index) => (
                <div className="match-row" key={index}>

                  <div className="match-name">
                    {match}
                    <span className="match-time">
                      / 26/05/2026 05:58 PM
                    </span>
                  </div>

                  <div className="odds-section">

                    <div className="blue-box">
                      1.84
                    </div>

                    <div className="pink-box">
                      1.85
                    </div>

                    <div className="blue-box">
                      2.16
                    </div>

                    <div className="pink-box">
                      2.18
                    </div>

                  </div>

                </div>
              ))
            }

          </div>

          {/* CASINO CARDS */}
          <div className="casino-grid">

            {
              casinoCards.map((img, index) => (
                <div className="casino-card" key={index}>
                  <img src={img} alt="" />
                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;