import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import { useMap } from "react-map-gl";
import {
  useGetSelectedUserPost,
  useOnFollingSnapshot,
} from "../../utils/hooks/useFirestoreData";
import {
  getSelectedUserProfile,
  handleFollow,
  getFollowers,
  getIsFollowingUsers,
} from "../../utils/firebase";
import PostDialog from "../../components/PostDialog/PostDialog";

export default function OtherUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followingUserNumber, setFollowingUserNumber] = useState(null);

  const { selectedUserGlobe } = useMap();

  const userPosts = useGetSelectedUserPost(id);
  const { followingUsers, setFollowingUsers } = useOnFollingSnapshot();
  const {
    currentUser,
    isModalOpen,
    setIsModalOpen,
    setSelectedPost,
    selectedPost,
  } = usePostData();

  useEffect(() => {
    const result = followingUsers.some((user) => user.id === id);
    setIsFollowing(result);
  }, [id, followingUsers]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getSelectedUserProfile(id);
        if (profile) {
          setUserProfile(profile);
        } else {
          alert("查無該用戶");
          navigate("/");
        }

        const followersData = await getFollowers(id);
        setFollowers(followersData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [id, followingUsers]);

  useEffect(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const fetchFollowingQuantity = async () => {
      try {
        const quantity = await getIsFollowingUsers(id);
        setFollowingUserNumber(quantity);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFollowingQuantity();
  }, [id]);

  async function onFollowClick(data, boolean) {
    try {
      const result = await handleFollow(currentUser.id, data, boolean);
      setIsFollowing(result);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleShowPostModal(post) {
    try {
      await setSelectedPost(post);
    } catch (e) {
      console.log(e);
    } finally {
      document.getElementById("PostDialog").showModal();
    }
  }

  return (
    <div className="bg-[#F0F5F9] flex flex-col grow p-7 relative">
      {userProfile && (
        <header className="flex items-center gap-5 mb-4">
          <figure className="flex flex-col items-center">
            <div className="avatar relative items-center w-full flex justify-center">
              {userProfile.avatar !== "" ? (
                <div className="w-24 rounded-full">
                  <img src={userProfile.avatar} />
                </div>
              ) : (
                <div className="w-20 rounded-full relative bg-slate-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
            </div>
          </figure>
          <section className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[#1E2022] text-lg">
                {userProfile.username}
              </span>
              {isFollowing ? (
                <button
                  className="btn min-h-0 h-[2.25rem] bg-[#F0F5F9] text-[#52616B] border border-[#bfc7d1]"
                  onClick={() => onFollowClick(userProfile, false)}
                >
                  關注中
                </button>
              ) : (
                <button
                  className="btn min-h-0 h-[2.25rem] bg-[#1E2022] text-[#F0F5F9]"
                  onClick={() => onFollowClick(userProfile, true)}
                >
                  關注
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex items-center">
                <span className="text-[#52616B] font-semibold">
                  {userPosts ? `${userPosts.length}` : "0"}
                </span>
                <span className="text-[#52616B]">公開貼文</span>
              </div>

              <div className="flex items-center">
                <span className="text-[#52616B] font-semibold">
                  {followers ? `${followers.length}` : "0"}
                </span>
                <span className="text-[#52616B]">粉絲</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#52616B] font-semibold">
                  {followingUserNumber ? `${followingUserNumber}` : "0"}
                </span>
                <span className="text-[#52616B]">關注中</span>
              </div>
            </div>
          </section>
        </header>
      )}
      <blockquote className="text-[#52616B]">{userProfile?.quote}</blockquote>
      <div className="divider"></div>
      {userPosts && (
        <div className="flex flex-wrap justify-center gap-5 ">
          {userPosts.length !== 0 ? (
            userPosts?.map((eachpost) => (
              <div
                className="card w-full bg-base-100 cursor-pointer shadow-[4px_4px_4px_rgba(0,0,0,.2)]"
                key={eachpost.id}
                onClick={() => {
                  handleShowPostModal(eachpost);
                  setIsModalOpen(true);
                  selectedUserGlobe.flyTo({
                    center: [eachpost.coordinates[0], eachpost.coordinates[1]],
                    zoom: 4,
                  });
                }}
              >
                <figure className="relative h-[110px]">
                  {eachpost.photos.length === 0 ? (
                    <button className="h-[100px] bg-gray-300 w-full flex items-center justify-center">
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
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </button>
                  ) : (
                    <button className="w-full">
                      <img
                        className="w-full h-full object-fit object-cover object-center card_img"
                        src={eachpost.photos[0]}
                        alt="post_photo"
                      />
                    </button>
                  )}
                </figure>
                <div className="card-body p-5 bg-[#C9D6DF] rounded-b-lg">
                  <button
                    className={"card-title text-left text-[#1E2022]"}
                    onClick={() => {
                      handleShowPostModal(eachpost);
                      setIsModalOpen(true);
                      selectedUserGlobe.flyTo({
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
                  <button
                    className="flex items-center text-[#52616B]"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedUserGlobe.flyTo({
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
                    <span className="mr-auto text-base">
                      {eachpost.destination}
                    </span>
                    <div className="badge badge-outline h-[30px]">
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
            ))
          ) : (
            <>
              <div className="flex flex-col h-full">
                <div className="flex items-center ">
                  <div className="skeleton w-[80px] h-[80px] rounded-full shrink-0"></div>
                  <div className="flex items-center mr-auto ml-3">
                    <div className="skeleton h-4 w-20"></div>
                  </div>
                </div>
                <div className="divider divider-neutral"></div>
                <article className="flex flex-wrap justify-center gap-3">
                  <div className="skeleton h-[288px] w-[384px]"></div>
                  <div className="skeleton h-[288px] w-[384px]"></div>
                  <div className="skeleton h-[288px] w-[384px]"></div>
                </article>
              </div>
            </>
          )}
        </div>
      )}
      {selectedPost && (
        <PostDialog
          post={selectedPost}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setSelectedPost={setSelectedPost}
        />
      )}
    </div>
  );
}
