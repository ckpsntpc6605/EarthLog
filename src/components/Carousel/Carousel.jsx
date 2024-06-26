import React from "react";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css";
import { useIsModalOpen } from "../../utils/zustand";

export default function Carousel({ imgs }) {
  const { isModalOpen } = useIsModalOpen();
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      slideshadows={false}
      className={`${
        isModalOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {imgs?.map((perimg, index) => (
        <SwiperSlide
          key={index}
          className={`${isModalOpen ? "pointer-events-auto" : "hidden"}`}
        >
          <img
            src={perimg}
            alt=""
            className="pointer-events-none shadow-[_4px_6px_10px_rgba(0,0,0,.3)] rounded-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function SinglePostCarousel({ imgs }) {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      cardsEffect={{
        slideshadows: false,
      }}
    >
      {imgs?.map((perimg, index) => (
        <SwiperSlide key={index} className="overflow-hidden relative">
          <img
            src={perimg}
            alt={`photos_${index}`}
            className="shadow-[_4px_6px_10px_rgba(0,0,0,.3)] rounded-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function CarouselCard() {}
