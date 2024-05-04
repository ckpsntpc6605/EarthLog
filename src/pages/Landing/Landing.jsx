import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "animate.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const container = useRef();
  // const tl = useRef();

  useEffect(() => {
    gsap.set(".landing-item", { x: "-100%" });

    gsap.to(".landing-item", {
      x: "0%",
      duration: 1,
      stagger: 0.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".landing",
        start: "top 80%",
      },
    });
  }, []);

  return (
    <div ref={container} className="h-screen relative">
      <img
        src="/images/content.png"
        alt="content"
        className="absolute inset-0 w-full h-full object-cover "
      />
      <div className="h-fit relative flex flex-col justify-center items-center">
        <section className="z-10 h-screen flex flex-col text-center items-center justify-center">
          <div>
            <img src="/images/logo.png" alt="logo" />
          </div>
          <h1 className="text-[36px] mb-10">One Earth, Infinite Memories</h1>
          <p className="text-xl font-light">一個紀錄旅行的日記。</p>
        </section>
        <section className="w-screen h-screen bg-slate-800 flex justify-center items-center">
          <div className="w-9/12 h-9/12 flex flex-wrap text-white">
            <div className="w-1/2">
              <img src="/images/landing_1.jpg" alt="landing_1" />
            </div>
            <div className="w-1/2 p-7 flex items-center landing-item">
              <span className="text-lg leading-7 tracking-wider">
                書寫屬於你的旅行故事,在地球上留下獨一無二的足跡,探索世界的每一個角落。讓這個應用成為你的旅行夥伴,陪伴你走遍城市與鄉村,記錄下你獨特的人生旅程。
              </span>
            </div>
            <div className="w-1/2  p-7 flex items-center flex flex-col justify-center">
              <span className="text-lg leading-7 tracking-wider italic">
                「 The world is a book and those who do not travel read only one
                page. 」
              </span>
              <span className="text-lg leading-7 tracking-wider italic ml-auto">
                -- St. Augustine
              </span>
            </div>
            <div className="w-1/2">
              <img src="/images/landing_2.jpg" alt="landing_2" />
            </div>
          </div>
        </section>
        <section className="w-screen py-5 mih-h-[100px] bg-[rgba(0,0,0,.3)] flex flex-col justify-center items-center">
          <button
            className="text-[24px] flex items-center w-fit py-2 px-4 mb-3 bg-gray-500 border border-gray-500 bg-opacity-55 rounded-full hover:border-white hover:text-white"
            onClick={() => navigate("/")}
          >
            Start your diary
            <ChevronRight
              size={32}
              className="animate__animated animate__fadeOutRight animate__infinite"
            />
          </button>
        </section>
      </div>
    </div>
  );
}
