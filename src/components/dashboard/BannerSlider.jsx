import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./BannerSlider.css";

const banners = [
  {
    id: 1,
    bg: "linear-gradient(135deg, #0a2a1a 0%, #0d3b22 50%, #1a5c35 100%)",
    tag: "LIVE NOW",
    tagColor: "#f56565",
    title: "IPL 2025",
    subtitle: "Gujarat Titans vs Rajasthan Royals",
    desc: "Live betting available • Best odds guaranteed",
    btn: "Bet Now",
    accent: "#00e676",
    emoji: "🏏",
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #0a1a2a 0%, #0d2b3b 50%, #1a3d5c 100%)",
    tag: "FEATURED",
    tagColor: "#f6c90e",
    title: "Wimbledon 2025",
    subtitle: "Djokovic vs Alcaraz",
    desc: "Centre Court • Grand Slam Final",
    btn: "View Odds",
    accent: "#63b3ed",
    emoji: "🎾",
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #1a0a2a 0%, #2b0d3b 50%, #3d1a5c 100%)",
    tag: "CASINO",
    tagColor: "#ed64a6",
    title: "Live Casino",
    subtitle: "Roulette • Blackjack • Baccarat",
    desc: "Real dealers • Real time • Real wins",
    btn: "Play Now",
    accent: "#ed64a6",
    emoji: "🎰",
  },
  {
    id: 4,
    bg: "linear-gradient(135deg, #1a1a0a 0%, #2b2b0d 50%, #3d3d1a 100%)",
    tag: "BONUS",
    tagColor: "#00e676",
    title: "Welcome Bonus",
    subtitle: "100% up to ₹10,000",
    desc: "New members only • T&C apply",
    btn: "Claim Bonus",
    accent: "#f6c90e",
    emoji: "🎁",
  },
];

const BannerSlider = () => {
  return (
    <div className="bs-root">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="bs-swiper"
      >
        {banners.map((b) => (
          <SwiperSlide key={b.id}>
            <div className="bs-slide" style={{ background: b.bg }}>
              <div className="bs-content">
                <span className="bs-tag" style={{ background: b.tagColor }}>{b.tag}</span>
                <div className="bs-emoji">{b.emoji}</div>
                <h2 className="bs-title" style={{ color: b.accent }}>{b.title}</h2>
                <p className="bs-subtitle">{b.subtitle}</p>
                <p className="bs-desc">{b.desc}</p>
                <button className="bs-btn" style={{ background: b.accent, color: b.accent === "#f6c90e" || b.accent === "#63b3ed" ? "#000" : "#000" }}>
                  {b.btn}
                </button>
              </div>
              <div className="bs-deco" style={{ color: b.accent }}>{b.emoji}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
