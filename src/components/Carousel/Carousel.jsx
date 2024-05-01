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

export default function Carousel({ imgs }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      effect="fade"
    >
      {imgs?.map((perimg, index) => (
        <SwiperSlide key={index}>
          <img src={perimg} alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
