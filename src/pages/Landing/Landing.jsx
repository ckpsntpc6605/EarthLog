import { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "animate.css";

import style from "./landing.module.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".left_img",
      {
        x: -100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".left_img",
          start: "top bottom",
          end: "top center",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });

  useGSAP(() => {
    gsap.fromTo(
      ".right_text",
      {
        x: 100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".right_text",
          start: "top bottom",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });

  useGSAP(() => {
    gsap.fromTo(
      ".left_text",
      {
        x: -100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".left_img",
          start: "top bottom",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });

  useGSAP(() => {
    gsap.fromTo(
      ".right_img",
      {
        x: 100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".right_text",
          start: "top bottom",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });
  useGSAP(() => {
    gsap.fromTo(
      ".gaspAsideText",
      {
        x: -100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".gaspAsideText",
          start: "top bottom",
          end: "top center",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });
  useGSAP(() => {
    gsap.fromTo(
      ".gaspFigureImg",
      {
        x: 100,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".gaspFigureImg",
          start: "top bottom",
          end: "top center",
          toggleActions: "restart none reverse none",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 2,
      }
    );
  });

  return (
    <div className="h-screen relative">
      <div
        className={`absolute inset-0 w-full h-full object-cover ${style.contentImg}`}
      ></div>
      <div className="h-fit relative flex flex-col justify-center items-center">
        <section className="z-10 h-screen flex flex-col text-center items-center justify-center">
          <div>
            <img src="/images/logo.png" alt="logo" />
          </div>
          <h1 className="text-[36px] text-[#e1e4e6] mb-10 italic">
            One Earth, Infinite Memories
          </h1>
          <p className="text-xl font-light text-[#bfc7d1]">
            一個紀錄旅行的日記。
          </p>
          <button
            className="text-[24px] mt-[100px] flex items-center w-fit py-2 pr-5 pl-7 mb-3 bg-gray-300 border hover:bg-[rgba(0,0,0,.5)] border-gray-300 rounded-full hover:border-white hover:text-white transition-colors"
            onClick={() => navigate("/")}
          >
            <span>Start your diary</span>

            <ChevronRight
              size={32}
              className="animate__animated animate__fadeOutRight animate__infinite"
            />
          </button>
        </section>
        <section
          ref={containerRef}
          className="w-screen h-screen bg-slate-800 flex justify-center items-center"
        >
          <div className="w-10/12 h-full flex flex-col items-center justify-center flex-wrap gap-y-20 text-white">
            <aside
              className="w-full h-2/5 2xl:max-w-[80%] max-h-[400px] flex justify-end items-center bg-cover bg-center relative"
              style={{ backgroundImage: "url(/images/content.png)" }}
            >
              <div className="absolute -left-8 -top-8 w-1/2 max-w-[602px]">
                <img
                  src="/images/landing_1.jpg"
                  alt="landing_1"
                  ref={imgRef}
                  className="left_img"
                />
              </div>
              <div className="w-1/2  p-7 flex flex-col items-center justify-center right_text">
                <span className="text-[40px] leading-9 tracking-widesr italic">
                  「 The world is a book and those who do not travel read only
                  one page. 」
                </span>
                <span className="text-lg leading-7 tracking-wider italic ml-auto">
                  -- St. Augustine
                </span>
              </div>
            </aside>
            <aside
              className="w-full h-2/5 2xl:max-w-[80%] max-h-[400px] flex items-center bg-cover bg-center relative"
              style={{ backgroundImage: "url(/images/content.png)" }}
            >
              <div className="w-1/2 p-9  flex items-center landing-item ">
                <span
                  className="text-xl leading-7 tracking-wider left_text"
                  ref={textRef}
                >
                  探索世界的每個角落， 紀錄每個旅行的足跡，
                  讓我們陪你走遍城市與鄉村，記錄你獨特的人生旅程。
                </span>
              </div>
              <div className="absolute -right-8 -top-8 w-1/2 max-w-[602px]">
                <img
                  src="/images/landing_2.jpg"
                  alt="landing_2"
                  className="right_img"
                />
              </div>
            </aside>
          </div>
        </section>
        <section className="w-screen p-20 h-screen bg-[#0F1C2E] flex gap-x-4 justify-center items-center">
          <aside className="flex flex-col gap-10 w-1/2 gaspAsideText">
            <h1 className="text-white text-[50px]">
              在地圖上標記地點，開始撰寫您的旅遊故事
            </h1>
            <p className="text-[#e0e0e0] text-lg leading-7 tracking-wide">
              旅行是一段故事的開始，每個標記都是一段回憶，每個地點都有著獨特的故事。您可以深藏珍貴的回憶,也可以分享無價的喜悅，讓廣大網友看見你精彩的故事。
            </p>
            <button
              className="text-[24px] flex items-center w-fit py-2 pr-5 mb-3 pl-7 bg-gray-300 border border-gray-500 rounded-full hover:bg-[rgba(0,0,0,.5)] hover:border-white hover:text-white transition-colors"
              onClick={() => navigate("/")}
            >
              Start your diary
              <ChevronRight
                size={32}
                className="animate__animated animate__fadeOutRight animate__infinite"
              />
            </button>
          </aside>
          <figure className="w-1/2 p-4 gaspFigureImg">
            <img
              src="/images/aside_img.png"
              alt="aside_img"
              className="rounded-lg"
            />
          </figure>
        </section>
        <footer className="w-screen py-5 h-auto bg-[#374357] flex justify-center items-center gap-3">
          <p className="text-slate-400">
            © Copyright 2024 EarthLog | All right reserved.
          </p>
          <div className="flex gap-3">
            <Link
              to={"https://www.facebook.com/profile.php?id=100000386602445"}
            >
              <img
                src="/images/facebook.png"
                alt="facebook"
                className="size-[30px]"
              />
            </Link>

            <img
              src="/images/instagram.png"
              alt="instagram"
              className="size-[30px]"
            />
            <img
              src="/images/linkedin.png"
              alt="linkedin"
              className="size-[30px]"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

{
  /* <img
        src="/images/content.png"
        alt="content"
        className="absolute inset-0 w-full h-full object-cover content_img"
      /> */
}
{
  /*  */
}
