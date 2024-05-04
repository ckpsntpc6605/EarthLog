import React from "react";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css";
// init Swiper:

export default function Carousel({ imgs, isModalOpen }) {
  console.log(isModalOpen);
  console.log(imgs);
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
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

// export default function EditCarousel({ imgs }) {
//   return (
//     <Swiper
//       modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
//       spaceBetween={50}
//       slidesPerView={1}
//       navigation
//       pagination={{ clickable: true }}
//       effect="fade"
//     >
//       {imgs?.map((perimg, index) => (
//         <SwiperSlide
//           key={index}
//         >
//           <img src={perimg} alt="" />
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// }

export function CarouselCard() {}
