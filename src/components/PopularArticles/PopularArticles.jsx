import React from "react";
import { useNavigate } from "react-router-dom";
import { useIsModalOpen } from "../../utils/zustand";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PublicPosts({
  publicPosts,
  getTheUserProfile,
  // setIsModalOpen,
  map_container,
  collectedPosts,
  handleCancelCollectPost,
  handleCollectPost,
  handleShowPostModal,
}) {
  const navigate = useNavigate();
  const { setIsModalOpen } = useIsModalOpen();
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      modules={[Pagination]}
    >
      {publicPosts?.map((eachpost) => (
        <SwiperSlide key={`${eachpost.id}_publicPost`}>
          <div
            className="card w-full bg-base-100 mb-3 cursor-pointer"
            key={eachpost.id}
            onClick={() => {
              getTheUserProfile(eachpost.authorID);
              handleShowPostModal(eachpost);
              // document.getElementById(`${eachpost.id}`).showModal();
              setIsModalOpen(true);
              map_container.flyTo({
                center: [eachpost.coordinates[0], eachpost.coordinates[1]],
                zoom: 4,
              });
            }}
          >
            <figure className="relative h-[110px] rounded-t-lg">
              {eachpost.photos.length === 0 ? (
                <div className="h-[110px] bg-gray-300 w-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              ) : (
                <div className="w-full h-full">
                  <img
                    className="w-full h-full object-cover object-center card_img"
                    src={eachpost.photos[0]}
                    alt="post_photo"
                  />
                </div>
              )}
            </figure>
            <div className="card-body text-[#52616B] px-[24px] py-[15px] bg-[#C9D6DF] rounded-b-lg transition-colors">
              <div className="flex w-full justify-between items-center">
                <button className={"card-title mr-auto text-left"}>
                  {eachpost.title}
                </button>
                {collectedPosts.some(
                  //判斷有沒收藏過了
                  (perpost) => perpost.id === eachpost.id
                ) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelCollectPost(eachpost.id);
                    }}
                  >
                    <img
                      src="/images/already-save.png"
                      alt=""
                      className="size-[20px]"
                    />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCollectPost(eachpost.id);
                    }}
                  >
                    <img
                      src="/images/save-instagram.png"
                      alt=""
                      className="size-[20px]"
                    />
                  </button>
                )}
              </div>
              <div className="flex w-full items-center justify-between ">
                <button
                  className="flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    map_container.flyTo({
                      center: [
                        eachpost.coordinates[0],
                        eachpost.coordinates[1],
                      ],
                      zoom: 6,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-earth mr-1"
                  >
                    <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                    <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" />
                    <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p className="text-base">{eachpost.destination}</p>
                </button>
                <div className="badge bg-[#8da9c4] text-black">
                  {eachpost.isPublic ? "公開" : "私人"}
                </div>
              </div>

              <div className="card-actions w-full justify-end">
                <span className="mr-auto text-[14px] text-gray-400 mt-3">
                  {eachpost.date}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${eachpost.authorID}`);
                  }}
                >
                  <div className="badge badge-outline h-[30px] hover:bg-[#1E2022] hover:text-[#F0F5F9]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {eachpost.author}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
