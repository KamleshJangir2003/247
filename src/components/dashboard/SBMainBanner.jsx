import React, { useState, useEffect } from "react";
import "./SBMainBanner.css";

import img1 from "../../assets/images/silder/1731820173329.webp";
import img2 from "../../assets/images/silder/1771220336277-722050072.png";
import img3 from "../../assets/images/silder/1771220336279-671789886.png";
import img4 from "../../assets/images/silder/1771261315528-342023838.webp";
import img5 from "../../assets/images/silder/1774727746638-247527026.webp";
import img6 from "../../assets/images/silder/1774727746639-660377855.webp";
import img7 from "../../assets/images/silder/1774727746651-476426483.webp";

const banners = [img1, img2, img3, img4, img5, img6, img7];

const SBMainBanner = () => {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur(p => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[cur];

  return (
    <div className="sbb-root">
      <img src={banners[cur]} alt={`banner-${cur + 1}`} className="sbb-img" />

      {/* BOTTOM CONTROLS */}
      <div className="sbb-controls">
        <button className="sbb-arrow" onClick={() => setCur(p => (p - 1 + banners.length) % banners.length)}>◀</button>
        <div className="sbb-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`sbb-dot ${i === cur ? "sbb-dot-active" : ""}`}
              onClick={() => setCur(i)}
            />
          ))}
        </div>
        <button className="sbb-arrow" onClick={() => setCur(p => (p + 1) % banners.length)}>▶</button>
      </div>
    </div>
  );
};

export default SBMainBanner;
