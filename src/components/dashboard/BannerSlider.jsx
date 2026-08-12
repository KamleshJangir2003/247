import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./BannerSlider.css";

import img1 from "../../assets/images/silder/1731820173329.webp";
import img2 from "../../assets/images/silder/1771220336277-722050072.png";
import img3 from "../../assets/images/silder/1771220336279-671789886.png";
import img4 from "../../assets/images/silder/1771261315528-342023838.webp";
import img5 from "../../assets/images/silder/1774727746638-247527026.webp";
import img6 from "../../assets/images/silder/1774727746639-660377855.webp";
import img7 from "../../assets/images/silder/1774727746651-476426483.webp";

const banners = [img1, img2, img3, img4, img5, img6, img7];

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
        {banners.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="bs-slide">
              <img src={img} alt={`slide-${i + 1}`} className="bs-img" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
