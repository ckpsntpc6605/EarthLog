import React, { useState, useEffect, useReducer, useRef } from "react";
import { usePostData } from "../../context/dataContext";
import {
  useUserData,
  useOnFollingSnapshot,
} from "../../utils/hooks/useFirestoreData";
import {
  getPublicPosts,
  handleFollow,
  getPostComments,
  getSelectedUserProfile,
  collectPost,
  getCollectedPost,
  cancelCollect,
  deleteComment,
} from "../../utils/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storeComment } from "../../utils/firebase";
import { useMap } from "react-map-gl";
import Carousel from "../../components/Carousel/Carousel";
import { MapPinned, Trash2 } from "lucide-react";

const initialState = {
  isPuclicOrCollected: "publicPosts",
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "RESET_IS_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    case "SET_IS_IN_PUBLICPOST_OR_COLLECT":
      return {
        ...state,
        isPuclicOrCollected: action.payload,
      };

    default:
      return state;
  }
}

const SET_IS_LOADING = "SET_IS_LOADING";
const RESET_IS_LOADING = "RESET_IS_LOADING";
const SET_IS_IN_PUBLICPOST_OR_COLLECT = "SET_IS_IN_PUBLICPOST_OR_COLLECT";

export default function Forum() {
  const { map_container } = useMap();
  const { currentUser, isModalOpen, setIsModalOpen } = usePostData();
  const [publicPosts, setPublicPosts] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({
    avatar: "",
    email: "",
    id: "",
    username: "",
  });
  const [collectedPosts, setCollectedPosts] = useState([]);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        dispatch({ type: SET_IS_LOADING });
        const posts = await getPublicPosts();
        setPublicPosts(posts);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        dispatch({ type: RESET_IS_LOADING });
      }
    };

    fetchPublicPosts();
  }, []);

  useEffect(() => {
    async function fetchCollectedPosts() {
      const path = `users/${currentUser.id}/collectedPosts`;
      try {
        const posts = await getCollectedPost(path); //馬上從firebase再取下來

        const collectedpost = publicPosts.filter((perpost) => {
          for (let i = 0; i < posts.length; i++) {
            if (perpost.id === posts[i]) {
              return perpost;
            }
          }
        });
        setCollectedPosts(collectedpost);
      } catch (e) {
        console.log(e);
      }
    }
    fetchCollectedPosts();
  }, [currentUser, publicPosts]); //新增收藏之後不會即時得到新收藏的psotID新增收藏之後不會即時得到新收藏的psotID新增收藏之後不會即時得到新收藏的psotID新增收藏之後不會即時得到新收藏的psotID

  async function getTheUserProfile(authorID) {
    try {
      const userData = await getSelectedUserProfile(authorID);
      await setSelectedUserData(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async function showSelectedUserProfile(authorID) {
    try {
      const userData = await getSelectedUserProfile(authorID);
      await setSelectedUserData(userData);
      await document.getElementById("UserProfileDialog").showModal();
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCollectPost(postID) {
    const path = `users/${currentUser.id}/collectedPosts/${postID}`;
    const getPostsPath = `users/${currentUser.id}/collectedPosts`;
    try {
      const result = await collectPost(path); //新增收藏之後，只收藏id
      const posts = await getCollectedPost(getPostsPath); //馬上從firebase再取下來
      if (result) {
        //成功新增
        const collectedpost = publicPosts.filter((perpost) => {
          for (let i = 0; i < posts.length; i++) {
            if (perpost.id === posts[i]) {
              return perpost;
            }
          }
        });
        setCollectedPosts(collectedpost);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCancelCollectPost(postID) {
    const path = `users/${currentUser.id}/collectedPosts/${postID}`;
    const getPostsPath = `users/${currentUser.id}/collectedPosts`;
    try {
      await cancelCollect(path);
      const posts = await getCollectedPost(getPostsPath);
      const collectedpost = publicPosts.filter((perpost) => {
        for (let i = 0; i < posts.length; i++) {
          if (perpost.id === posts[i]) {
            return perpost;
          }
        }
      });
      setCollectedPosts(collectedpost);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSwitchTab(tag) {
    dispatch({ type: SET_IS_IN_PUBLICPOST_OR_COLLECT, payload: tag });
  }

  return (
    <main className="bg-[#2b2d42] flex flex-1 flex-col p-5 relative">
      <header className="mb-4 flex justify-center">
        <div role="tablist" className="tabs tabs-lifted w-96 lg:w-full">
          <a
            id="publicPosts"
            role="tab"
            className={`tab ${
              state.isPuclicOrCollected === "publicPosts" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-white`}
            onClick={() => handleSwitchTab("publicPosts")}
          >
            公開貼文
          </a>
          <a
            id="myCollection"
            role="tab"
            className={`tab ${
              state.isPuclicOrCollected === "collectedPost" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-white`}
            onClick={() => handleSwitchTab("collectedPost")}
          >
            我的收藏
            <img
              src="/images/save-instagram.png"
              alt=""
              className="size-[16px] ml-1"
            />
          </a>
        </div>
      </header>
      {/* Public Post or Collected Post */}
      <div className="flex flex-wrap justify-center gap-3 2xl:justify-around">
        {state.isLoading && (
          <>
            <div className="skeleton h-[216px] w-96 mb-3"></div>
            <div className="skeleton h-[216px] w-96 mb-3"></div>
            <div className="skeleton h-[216px] w-96 mb-3"></div>
          </> //Loading skeleton
        )}
        {state.isPuclicOrCollected === "publicPosts"
          ? // Public  Public  Public  Public  Public  Public  Public  Public
            publicPosts?.map((eachpost) => (
              <>
                <div
                  className="card w-[400px] h-[230px] bg-base-100 shadow-xl mb-3"
                  key={eachpost.id}
                >
                  <figure className="relative h-[100px]">
                    {eachpost.photos.length === 0 ? (
                      <button
                        className="h-[100px] bg-gray-300 w-full flex items-center justify-center"
                        onClick={() => {
                          getTheUserProfile(eachpost.authorID);
                          document.getElementById(`${eachpost.id}`).showModal();
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
                          getTheUserProfile(eachpost.authorID);
                          document.getElementById(`${eachpost.id}`).showModal();
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
                  <div className="card-body p-3">
                    <div className="flex items-center">
                      <button
                        className={"card-title mr-auto text-left"}
                        onClick={() => {
                          getTheUserProfile(eachpost.authorID);
                          document.getElementById(`${eachpost.id}`).showModal();
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
                        (perpost) => perpost.id === eachpost.id
                      ) ? (
                        <button
                          onClick={() => handleCancelCollectPost(eachpost.id)}
                        >
                          <img
                            src="/images/already-save.png"
                            alt=""
                            className="size-[20px] "
                          />
                        </button>
                      ) : (
                        <button onClick={() => handleCollectPost(eachpost.id)}>
                          <img
                            src="/images/save-instagram.png"
                            alt=""
                            className="size-[20px] "
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
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

                    <div className="card-actions justify-end">
                      <span className="mr-auto text-[14px] text-gray-400">
                        {eachpost.date}
                      </span>
                      <button
                        onClick={() =>
                          showSelectedUserProfile(eachpost.authorID)
                        }
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
                  <PostDialog
                    post={eachpost}
                    currentUser={currentUser}
                    selectedUserData={selectedUserData}
                    setSelectedUserData={setSelectedUserData}
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                  />
                </div>
              </>
            ))
          : collectedPosts?.map((eachpost) => (
              <div
                className="card w-[400px] h-[230px] bg-base-100 shadow-xl mb-3"
                key={eachpost.id}
              >
                <figure className="relative h-[100px]">
                  {eachpost?.photos?.length === 0 ? (
                    <div className="h-[100px] bg-gray-300 w-full flex items-center justify-center">
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
                    </div>
                  ) : (
                    <img
                      className="w-full h-full object-cover object-center"
                      src={eachpost?.photos[0]}
                      alt="post_photo"
                    />
                  )}
                </figure>
                <div className="card-body p-3">
                  <div className="flex items-center">
                    <button
                      className={"card-title mr-auto"}
                      onClick={() => {
                        getTheUserProfile(eachpost.authorID);
                        document.getElementById(`${eachpost.id}`).showModal();
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
                    <button
                      onClick={() => handleCancelCollectPost(eachpost.id)}
                    >
                      <img
                        src="/images/already-save.png"
                        alt=""
                        className="size-[20px] "
                      />
                    </button>
                  </div>
                  <div className="flex">
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
                    <div className="badge bg-[#8da9c4] text-black">
                      {eachpost.isPublic ? "公開" : "私人"}
                    </div>
                  </div>

                  <div className="card-actions justify-end items-center">
                    <span className="mr-auto text-[14px] text-gray-400">
                      {eachpost.date}
                    </span>
                    <button
                      onClick={() => showSelectedUserProfile(eachpost.authorID)}
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
                <PostDialog
                  post={eachpost}
                  currentUser={currentUser}
                  selectedUserData={selectedUserData}
                  setSelectedUserData={setSelectedUserData}
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                />
              </div>
            ))}
      </div>
      <UserProfileDialog
        posts={publicPosts}
        selectedUserData={selectedUserData}
        currentUser={currentUser}
        setIsModalOpen={setIsModalOpen}
      />
    </main>
  );
}

function PostDialog({
  post,
  currentUser,
  selectedUserData,
  setIsModalOpen,
  isModalOpen,
}) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ header: [1, 2, 3, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };
  const userData = useUserData(currentUser.id);
  const [comments, setComments] = useState([]);
  const [quillValue, setQuillValue] = useState("");

  useEffect(() => {
    (async () => {
      const path = `users/${post.authorID}/post/${post.id}/comments`;
      const commentData = await getPostComments(path);

      await setComments(commentData);
    })();
  }, [post]);

  async function handleSaveComment() {
    const path = `users/${post.authorID}/post/${post.id}/comments`;

    if (quillValue === "") {
      alert("請先輸入文字");
      return;
    }
    try {
      const currentDate = new Date();
      const commentData = {
        ...userData,
        comment: quillValue,
        commentTime: currentDate.toISOString(),
      };
      await storeComment(post.authorID, post.id, commentData);
      const newcomment = await getPostComments(path);
      await setComments(newcomment);
      setQuillValue("");
    } catch (e) {
      console.log(e);
    }
  }
  async function handleDaleteComment(commentID) {
    const path = `users/${post.authorID}/post/${post.id}/comments/${commentID}`;
    try {
      const result = await deleteComment(path);
      const newcomment = await getPostComments(
        `users/${post.authorID}/post/${post.id}/comments/`
      );
      await setComments(newcomment);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <dialog id={post.id} className="modal">
      <div className="modal-box border p-8 text-white border-gray-400 bg-[rgba(0,0,0,0.8)] backdrop-blur-md relative w-11/12 max-w-5xl flex flex-col gap-4">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
        </form>
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex items-center mb-3">
            <div className="font-bold text-sm flex gap-2 items-center">
              <MapPinned size={20} color="#f59e0b" />
              <span className="text-amber-500 mr-2">{post.destination} / </span>
            </div>
            <span className=""> {post.date}</span>
          </div>
          <div className="mr-auto">
            <h2 className="text-3xl mb-2 font-bold">{post.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="avatar relative size-[108px]">
              {selectedUserData.avatar !== "" ? (
                <div className="w-24 rounded-full">
                  <img
                    src={selectedUserData.avatar}
                    className="rounded-full "
                  />
                </div>
              ) : (
                <div className="w-24 rounded-full relative bg-slate-700">
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
            <span className="text-xl">{selectedUserData.username}</span>
          </div>
        </header>
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="mb-4 p-2 leading-8 indent-4 tracking-wide"
        ></article>
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
                      <div className="w-14 rounded-full">
                        <img src={eachcomment.avatar} />
                      </div>
                    ) : (
                      <div className="w-24 rounded-full relative bg-slate-700">
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

function UserProfileDialog({
  posts,
  selectedUserData,
  currentUser,
  setIsModalOpen,
}) {
  const selectedUserPosts = posts.filter(
    (eachpost) => eachpost.authorID === selectedUserData.id
  );
  const { followingUsers, setFollowingUsers } = useOnFollingSnapshot();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const result = followingUsers.some(
      (user) => user.id === selectedUserData.id
    );
    setIsFollowing(result);
  }, [selectedUserData]);

  async function onFollowClick(data, boolean) {
    try {
      const result = await handleFollow(currentUser.id, data, boolean);
      setIsFollowing(result);
    } catch (e) {
      console.log(e);
    }
  }

  return selectedUserData ? (
    <dialog id="UserProfileDialog" className="modal ">
      <div className="modal-box w-11/12 max-w-5xl bg-[#E1ECF7]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="avatar relative items-center w-full">
          {selectedUserData.avatar !== "" ? (
            <div className="w-[70px] h-[70px] rounded-full">
              <img src={selectedUserData.avatar} />
            </div>
          ) : (
            <div className="w-24 rounded-full relative bg-slate-700">
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

          <span className="text-slate-400 mr-auto ml-2">
            {selectedUserData.username}
          </span>
          {isFollowing ? (
            <button
              className="btn"
              onClick={() => onFollowClick(selectedUserData, false)}
            >
              取消關注
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => onFollowClick(selectedUserData, true)}
            >
              關注
            </button>
          )}
        </div>
        <div className="divider">已發表的文章</div>
        <div className="flex flex-wrap gap-2">
          {selectedUserPosts.length !== 0 ? (
            selectedUserPosts?.map((eachpost) => (
              <div
                className="card w-80 bg-base-100 shadow-xl mb-3 hover:scale-105 transition-transform"
                key={eachpost.id}
              >
                <figure className="relative">
                  {eachpost.photos.length === 0 ? (
                    <div className="h-[100px] bg-gray-300 w-full flex items-center justify-center">
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
                    </div>
                  ) : (
                    <img
                      className="w-full h-[100px] object-cover object-center"
                      src={eachpost.photos[0]}
                      alt="post_photo"
                    />
                  )}
                </figure>
                <div className="card-body">
                  <button
                    onClick={() => {
                      document.getElementById(`${eachpost.id}`).showModal();
                      setIsModalOpen(true);
                    }}
                    className={"card-title text-left"}
                  >
                    {eachpost.title}
                    {/* <div className="badge bg-[#8da9c4] text-black">
                      {eachpost.isPublic ? "公開" : "私人"}
                    </div> */}
                  </button>
                  <div className="flex">
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
                  </div>

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
            <h2>該用戶尚無貼文</h2>
          )}
        </div>
      </div>
    </dialog>
  ) : (
    <></>
  );
}
