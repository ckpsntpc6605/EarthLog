import React from "react";
import { useNavigate } from "react-router-dom";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

export default function PublicPosts({
  publicPosts,
  getTheUserProfile,
  setIsModalOpen,
  map_container,
  collectedPosts,
  handleCancelCollectPost,
  handleCollectPost,
  handleShowPostModal,
}) {
  const navigate = useNavigate();
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSwiper={(swiper) => console.log(swiper)}
      navigation={true}
      modules={[Navigation]}
    >
      {publicPosts?.map((eachpost) => (
        <SwiperSlide key={`${eachpost.id}_publicPost`}>
          <div
            className="card w-[380px] h-[230px] bg-base-100 shadow-[4px_7px_4px_rgba(0,0,0,.2)] mb-3"
            key={eachpost.id}
          >
            <figure className="relative h-[100px]">
              {eachpost.photos.length === 0 ? (
                <button
                  className="h-[100px] bg-gray-300 w-full flex items-center justify-center"
                  onClick={() => {
                    getTheUserProfile(eachpost.authorID);
                    handleShowPostModal(eachpost);
                    // setSelectedPost(eachpost);
                    // document.getElementById(`${eachpost.id}`).showModal();
                    setIsModalOpen(true);
                    map_container.flyTo({
                      center: [
                        eachpost.coordinates[0],
                        eachpost.coordinates[1],
                      ],
                      zoom: 4,
                    });
                  }}
                >
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
                    class="lucide lucide-image"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    getTheUserProfile(eachpost.authorID);
                    handleShowPostModal(eachpost);
                    // document.getElementById(`${eachpost.id}`).showModal();
                    setIsModalOpen(true);
                    map_container.flyTo({
                      center: [
                        eachpost.coordinates[0],
                        eachpost.coordinates[1],
                      ],
                      zoom: 4,
                    });
                  }}
                >
                  <img
                    className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                    src={eachpost.photos[0]}
                    alt="post_photo"
                  />
                </button>
              )}
            </figure>
            <div className="card-body text-[#52616B] p-3 bg-[#C9D6DF] rounded-b-lg hover:text-gray-300 hover:bg-[linear-gradient(90deg,_#1e2022,_#34373b)] transition-colors">
              <div className="flex w-full justify-between items-center">
                <button
                  className={"card-title mr-auto text-left"}
                  onClick={() => {
                    getTheUserProfile(eachpost.authorID);
                    handleShowPostModal(eachpost);
                    // document.getElementById(`${eachpost.id}`).showModal();
                    setIsModalOpen(true);
                    map_container.flyTo({
                      center: [
                        eachpost.coordinates[0],
                        eachpost.coordinates[1],
                      ],
                      zoom: 4,
                    });
                  }}
                >
                  {eachpost.title}
                </button>
                {collectedPosts.some(
                  //判斷有沒收藏過了
                  (perpost) => perpost.id === eachpost.id
                ) ? (
                  <button onClick={() => handleCancelCollectPost(eachpost.id)}>
                    <img
                      src="/images/already-save.png"
                      alt=""
                      className="size-[20px]"
                    />
                  </button>
                ) : (
                  <button onClick={() => handleCollectPost(eachpost.id)}>
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
                  className="flex"
                  onClick={() => {
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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    class="lucide lucide-earth"
                  >
                    <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                    <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" />
                    <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p>{eachpost.destination}</p>
                </button>
                <div className="badge bg-[#8da9c4] text-black">
                  {eachpost.isPublic ? "公開" : "私人"}
                </div>
              </div>

              <div className="card-actions w-full justify-end">
                <span className="mr-auto text-[14px] text-gray-400">
                  {eachpost.date}
                </span>
                <button
                  onClick={() => navigate(`/profile/${eachpost.authorID}`)}
                >
                  <div className="badge badge-outline">
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
                      class="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {eachpost.author}
                  </div>
                </button>
              </div>
            </div>
            {/* <PostDialog
              post={eachpost}
              currentUser={currentUser}
              selectedUserData={selectedUserData}
              setSelectedUserData={setSelectedUserData}
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
            /> */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
