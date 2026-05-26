import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./home.css";
import img1 from "../assets/images/20_20_poker.webp"; import img2 from "../assets/images/29b.webp"; import img3 from "../assets/images/6pp.webp"; import img4 from "../assets/images/Aviator.png"; import img5 from "../assets/images/dt_mac88.webp"; import img6 from "../assets/images/dt2.webp"; import img7 from "../assets/images/poker_1_day.webp"; import img8 from "../assets/images/roulette_mac88.webp"; import img9 from "../assets/images/sicbo_mac88.webp"; import img10 from "../assets/images/LOBBY.png";
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

  const casinoCards = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

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

      <Footer />

    </div>
  );
};

export default Home;