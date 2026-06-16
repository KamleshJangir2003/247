import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingSocialBar from "../components/FloatingSocialBar";
import GameModal from "../components/livecasino/GameModal";
import "./home.css";

/* ================= SLIDER IMAGES ================= */

import slide1 from "../assets/images/silder/1731820173329.webp";
import slide2 from "../assets/images/silder/1771220336277-722050072.png";
import slide3 from "../assets/images/silder/1771220336279-671789886.png";
import slide4 from "../assets/images/silder/1771261315528-342023838.webp";
import slide5 from "../assets/images/silder/1774727746638-247527026.webp";
import slide6 from "../assets/images/silder/1774727746639-660377855.webp";
import slide7 from "../assets/images/silder/1774727746651-476426483.webp";

/* ================= CASINO IMAGES ================= */

import img1 from "../assets/images/20_20_poker.webp";
import img2 from "../assets/images/29b.webp";
import img3 from "../assets/images/6pp.webp";
import img4 from "../assets/images/Aviator.png";
import img5 from "../assets/images/dt_mac88.webp";
import img6 from "../assets/images/dt2.webp";
import img7 from "../assets/images/poker_1_day.webp";
import img8 from "../assets/images/roulette_mac88.webp";
import img9 from "../assets/images/sicbo_mac88.webp";
import img10 from "../assets/images/LOBBY.png";

/* ================= SLIDER ARRAY ================= */

const sliderImages = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
];

/* ── All games with proper names mapped to images + routes ── */
const allGames = [
  { name: "20-20 Poker",      img: img1,  badge: "LIVE", route: "/live-casino" },
  { name: "29 Card Baccarat", img: img2,  badge: "LIVE", route: "/live-casino" },
  { name: "6 Player Poker",   img: img3,  badge: "LIVE", route: "/live-casino" },
  { name: "Aviator",          img: img4,  badge: "HOT",  route: "/slot" },
  { name: "Dragon Tiger",     img: img5,  badge: "LIVE", route: "/live-casino" },
  { name: "Dragon Tiger 2",   img: img6,  badge: "LIVE", route: "/live-casino" },
  { name: "Poker 1 Day",      img: img7,  badge: "LIVE", route: "/live-casino" },
  { name: "Roulette",         img: img8,  badge: "LIVE", route: "/live-casino" },
  { name: "Sic Bo",           img: img9,  badge: "LIVE", route: "/live-casino" },
  { name: "Casino Lobby",     img: img10, badge: "LIVE", route: "/live-casino" },
];

const navSections = [
  { label: "Live Casino",   route: "/live-casino",   icon: "🎰" },
  { label: "Sportsbook",    route: "/sportsbook1",   icon: "⚽" },
  { label: "Exchange",      route: "/exchange",      icon: "🔄" },
  { label: "Slot Games",    route: "/slot",          icon: "🎰" },
  { label: "Lottery",       route: "/lottery",       icon: "🎟️" },
  { label: "Fantasy Games", route: "/fantasy-games", icon: "🏆" },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (

    <div className="home-page">

      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= IMAGE SLIDER ================= */}

      <div className="image-slider">

        {/* LEFT ARROW */}

        <div
          className="slider-arrow left-arrow"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + sliderImages.length) %
                sliderImages.length
            )
          }
        >
          ❮
        </div>

        {/* SLIDER IMAGE */}

        <img
          src={sliderImages[currentSlide]}
          alt="slide"
          className="slider-img"
        />

        {/* RIGHT ARROW */}

        <div
          className="slider-arrow right-arrow"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev + 1) % sliderImages.length
            )
          }
        >
          ❯
        </div>

        {/* DOTS */}

        <div className="slider-dots">

          {
            sliderImages.map((_, i) => (

              <span
                key={i}
                className={`dot ${
                  i === currentSlide
                    ? "active-dot"
                    : ""
                }`}
                onClick={() => setCurrentSlide(i)}
              />

            ))
          }

        </div>

      </div>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="main-layout">

        {/* ================= CONTENT ================= */}

        <div className="content-area">

          {/* ================= GAME CATEGORY NAV ================= */}
          <div className="home-cat-nav">
            {navSections.map((s) => (
              <div key={s.route} className="home-cat-btn" onClick={() => navigate(s.route)}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* ================= OUR LATEST CASINO ================= */}

          <div className="latest-casino-section">

            <div className="latest-title">
              OUR LATEST CASINO
            </div>

            <div className="latest-casino-slider">
              {
                allGames.map((game, index) => (
                  <div
                    className="latest-card"
                    key={index}
                    onClick={() => navigate(game.route)}
                  >
                    <img src={game.img} alt={game.name} />
                    <div className="latest-overlay">▶ PLAY</div>
                  </div>
                ))
              }
            </div>

          </div>

          {/* ================= OUR LIVE CASINOS ================= */}

          <div className="live-casino-section">

            <div className="live-title">
              OUR LIVE CASINOS
            </div>

            <div className="live-casino-grid">
              {
                [...allGames, ...allGames, ...allGames, ...allGames, ...allGames].map((game, index) => (
                  <div
                    className="live-card"
                    key={index}
                    onClick={() => navigate(game.route)}
                  >
                    <img src={game.img} alt={game.name} />
                    <div className="live-overlay">▶ PLAY</div>
                  </div>
                ))
              }
            </div>

          </div>

          {/* ================= CASINO GRID ================= */}

         {/* ================= TOP WINNERS ================= */}

<div className="top-winners-section">

  <div className="winner-title">
    TOP WINNERS
  </div>

{/* SLIDER WRAPPER */}

  <div className="winner-slider">

    <div className="winner-grid">

      {
        [
          1,2,3,4,5,6,
          1,2,3,4,5,6
        ].map((item, index) => (

          <div className="winner-card" key={index}>

            <div className="winner-user">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt=""
              />
            </div>

            <div className="winner-details">

              <div className="winner-row">
                <span>Player</span>
                <strong>km****1851</strong>
              </div>

              <div className="winner-row">
                <span>Time</span>
                <strong>27/05/2026 19:33</strong>
              </div>

              <div className="winner-row">
                <span>Win Amount</span>
                <strong>3,15,41,739</strong>
              </div>

            </div>

          </div>

        ))
      }

    </div>

  </div>

</div>


        </div>

      </div>
      

      {activeGame && (
        <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
      )}

      {/* ================= FLOATING SOCIAL BAR ================= */}
      <FloatingSocialBar />

      {/* ================= FOOTER ================= */}

      <Footer />

    </div>

  );
};

export default Home;
