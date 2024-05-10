import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import { useMap } from "react-map-gl";
import {
  useUserData,
  useGetSelectedUserPost,
  useOnFollingSnapshot,
} from "../../utils/hooks/useFirestoreData";
import {
  getSelectedUserProfile,
  getPostComments,
  handleFollow,
  getFollowers,
} from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import ReactQuill from "react-quill";
import Carousel from "../../components/Carousel/Carousel";
import { MapPinned, Trash2 } from "lucide-react";

export default function OtherUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);

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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    (async () => {
      const followersData = await getFollowers(id);
      setFollowers(followersData);
    })();
  }, [id, followingUsers]);

  useEffect(() => {
    setIsModalOpen(false);
  }, []);

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
    <div className="bg-[#F0F5F9] flex flex-col grow p-5 relative">
      {userProfile && (
        <header className="flex items-center justify-between">
          <figure className="flex flex-col items-center">
            <div className="avatar relative items-center w-full">
              {userProfile.avatar !== "" ? (
                <div className="w-20 rounded-full">
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
                    class="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-[#1E2022] text-lg">
              {userProfile.username}
            </span>
          </figure>
          <section className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[#52616B] font-semibold">
                {userPosts ? `${userPosts.length}` : "0"}
              </span>
              <span className="text-[#52616B]">公開貼文</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[#52616B] font-semibold">
                {followers ? `${followers.length}` : "0"}
              </span>
              <span className="text-[#52616B]">粉絲</span>
            </div>
          </section>

          {isFollowing ? (
            <button
              className="btn bg-[#F0F5F9] text-[#52616B]"
              onClick={() => onFollowClick(userProfile, false)}
            >
              關注中
            </button>
          ) : (
            <button
              className="btn bg-[#1E2022] text-[#F0F5F9]"
              onClick={() => onFollowClick(userProfile, true)}
            >
              關注
            </button>
          )}
        </header>
      )}
      <div className="divider"></div>
      {userPosts && (
        <div className="flex flex-wrap justify-center">
          {userPosts.length !== 0 ? (
            userPosts?.map((eachpost) => (
              <div
                className="card w-96 bg-base-100 shadow-xl mb-3"
                key={eachpost.id}
              >
                <figure className="relative h-[100px]">
                  {eachpost.photos.length === 0 ? (
                    <button
                      className="h-[100px] bg-gray-300 w-full flex items-center justify-center"
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
                    <button
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
                      <img
                        className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                        src={eachpost.photos[0]}
                        alt="post_photo"
                      />
                    </button>
                  )}
                </figure>
                <div className="card-body p-5">
                  <button
                    className={"card-title text-left"}
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
                    className="flex justify-start"
                    onClick={() => {
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
                    <span>{eachpost.destination}</span>
                  </button>

                  <div className="card-actions justify-end">
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
                  </div>
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

function PostDialog({ post, isModalOpen, setSelectedPost }) {
  const currentUser = useAuthListener();
  const userData = useUserData(currentUser.id);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    (async () => {
      const path = `users/${post.authorID}/post/${post.id}/comments`;
      const commentData = await getPostComments(path);
      await setComments(commentData);
    })();
  }, [post]);

  const [quillValue, setQuillValue] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "formula"],

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };
  async function handleSaveComment() {
    const path = `users/${post.authorID}/post/${post.id}/comments`;
    try {
      const commentData = {
        ...userData,
        comment: quillValue,
      };
      await storeComment(post.authorID, post.id, commentData);
      const newcomment = await getPostComments(path);
      await setComments(newcomment);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <dialog id="PostDialog" className="modal">
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setSelectedPost(null)}>close</button>
      </form>
      <div className="modal-box border p-8 text-white border-gray-400 bg-[rgba(0,0,0,0.8)] backdrop-blur-md relative w-11/12 max-w-5xl flex flex-col gap-4">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex items-center mb-3">
            <div className="font-bold text-sm flex gap-2 items-center">
              <MapPinned size={20} color="#f59e0b" />
              <span className="text-amber-500 mr-2">{post.destination} / </span>
            </div>
            <span className=""> {post.date}</span>
          </div>
          <div className="mr-auto mb-3">
            <h2 className="text-3xl mb-2 font-bold">{post.title}</h2>
          </div>
        </header>
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="mb-4 p-2 leading-8 indent-4 tracking-wide"
        ></article>
        <div className="divider divider-neutral"></div>
        <div className="flex justify-center w-1/2 self-center">
          <Carousel imgs={post.canvasImg} isModalOpen={isModalOpen} />
        </div>
        <div className="divider divider-neutral"></div>
        <section className="mb-5">
          {comments.length === 0 ? (
            <h1>該貼文尚無評論</h1>
          ) : (
            comments
              ?.sort(
                (a, b) =>
                  new Date(a.commentTime).getTime() -
                  new Date(b.commentTime).getTime()
                // 依留言時間排序
              )
              .map((eachcomment) => (
                <article
                  className="flex mb-4 relative"
                  key={`${eachcomment.commentID}`}
                >
                  <div className="avatar relative items-center flex-col mx-4 justify-center">
                    {eachcomment.avatar !== "" ? (
                      <div className="w-20 rounded-full">
                        <img src={eachcomment.avatar} />
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
                          class="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
                      </div>
                    )}
                    <span className="text-slate-400">
                      {eachcomment.username}
                    </span>
                  </div>
                  <div className="divider divider-horizontal"></div>
                  <div
                    className="mr-auto"
                    dangerouslySetInnerHTML={{ __html: eachcomment.comment }}
                  ></div>
                  <div className="self-end">
                    <span className="text-gray-400 text-sm">
                      {eachcomment.commentTime}
                    </span>
                  </div>
                  <button
                    className={`${
                      currentUser.id === eachcomment.id ? "" : "hidden"
                    } absolute top-1 right-1 opacity-30 hover:opacity-100 transition-all`}
                    onClick={() => handleDaleteComment(eachcomment.commentID)}
                  >
                    <Trash2 />
                  </button>
                </article>
              ))
          )}
        </section>
        <div className="divider divider-neutral"></div>
        <section>
          <h2 className="text-xl mb-4">留下你的評論：</h2>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={quillValue}
            onChange={setQuillValue}
          ></ReactQuill>
          <div className="flex justify-end">
            <button
              className="btn btn-active btn-neutral mt-2"
              onClick={handleSaveComment}
            >
              發表
            </button>
          </div>
        </section>
      </div>
    </dialog>
  );
}
