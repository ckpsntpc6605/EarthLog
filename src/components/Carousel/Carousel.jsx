import React from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css";
// init Swiper:

export default function Carousel({ imgs, isModalOpen }) {
  console.log(isModalOpen);
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      effect="fade"
      className={`${
        isModalOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {imgs?.map((perimg, index) => (
        <SwiperSlide
          key={index}
          className={`${isModalOpen ? "pointer-events-auto" : "hidden"}`}
        >
          <img src={perimg} alt="" className="pointer-events-none" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
