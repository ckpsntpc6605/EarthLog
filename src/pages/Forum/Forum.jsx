import React, { useState, useEffect } from "react";
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
} from "../../utils/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storeComment } from "../../utils/firebase";
import { useMap } from "react-map-gl";

export default function Forum() {
  const { map_container } = useMap();
  const { currentUser } = usePostData();
  const [publicPosts, setPublicPosts] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({
    avatar: "",
    email: "",
    id: "",
    username: "",
  });
  const [collectedPosts, setCollectedPosts] = useState([]);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const posts = await getPublicPosts();
        setPublicPosts(posts);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      }
    };

    fetchPublicPosts();
  }, []);

  useEffect(() => {
    async function fetchCollectedPosts() {
      const path = `users/${currentUser.id}/collectedPosts`;
      try {
        const posts = await getCollectedPost(path);
        setCollectedPosts(posts);
      } catch (e) {
        console.log(e);
      }
    }
    fetchCollectedPosts();
  }, [currentUser]);
  console.log(collectedPosts);

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
    const getPsotsPath = `users/${currentUser.id}/collectedPosts`;
    try {
      const result = await collectPost(path);
      const posts = await getCollectedPost(getPsotsPath);
      setCollectedPosts(posts);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSwitchTab(tag) {
    const publicPosts = document.querySelector("#publicPosts");
    const myCollection = document.querySelector("#myCollection");
    if (tag === "publicPosts") {
      publicPosts.classList.add("tab-active");
      myCollection.classList.remove("tab-active");
    } else {
      myCollection.classList.add("tab-active");
      publicPosts.classList.remove("tab-active");
    }
  }

  return (
    <main className="bg-[#2b2d42] min-h-full flex flex-1 flex-col p-5 relative">
      <header className="mb-4">
        <div role="tablist" className="tabs tabs-boxed">
          <a
            id="publicPosts"
            role="tab"
            className="tab"
            onClick={() => handleSwitchTab("publicPosts")}
          >
            公開貼文
          </a>
          <a
            id="myCollection"
            role="tab"
            className="tab tab-active"
            onClick={() => handleSwitchTab("myCollection")}
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
      <article className="flex flex-wrap">
        {publicPosts?.map((eachpost) => (
          <div
            className="card w-96 bg-base-100 shadow-xl mb-3"
            key={eachpost.id}
          >
            <figure className="relative h-[100px]">
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
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              ) : (
                <img
                  className="w-full h-full object-cover object-center"
                  src={eachpost.photos[0]}
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
                  <div className="badge bg-[#8da9c4] text-black">
                    {eachpost.isPublic ? "公開" : "私人"}
                  </div>
                </button>
                <button onClick={() => handleCollectPost(eachpost.id)}>
                  <img
                    src="/images/save-instagram.png"
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
              </div>

              <div className="card-actions justify-end">
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
            />
          </div>
        ))}
      </article>
      <UserProfileDialog
        posts={publicPosts}
        selectedUserData={selectedUserData}
        currentUser={currentUser}
      />
    </main>
  );
}

function PostDialog({ post, currentUser, selectedUserData }) {
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

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ header: [1, 2, 3, false] }],

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
    <dialog id={post.id} className="modal ">
      <div className="modal-box bg-yellow-100">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <header className="flex gap-4 items-center mb-4">
          <div className="flex flex-col">
            <div className="avatar relative size-[70px]">
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
            <span>{selectedUserData.username}</span>
          </div>
          <div>
            <h1 className="font-bold text-3xl mb-2">
              旅遊地點：{post.destination}
            </h1>
            <h2 className="text-xl mb-2">旅遊標題：{post.title}</h2>
          </div>
        </header>

        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="border min-h-[100px] mb-4 p-2 leading-[1.5] indent-4"
        ></article>
        <div className="carousel w-full">
          {post?.canvasImg?.map((eachImg, index) => (
            <div
              key={`slide-${index}`}
              id={`slide-${index}`}
              className="carousel-item relative w-full "
            >
              <div>
                <img src={eachImg} alt="2" className="rounded-md" />
              </div>
              {index !== 0 && (
                <a
                  href={`#slide-${index - 1}`}
                  className="btn btn-circle absolute top-1/2 left-0"
                >
                  ❮
                </a>
              )}
              {index !== post.canvasImg.length - 1 && (
                <a
                  href={`#slide-${index + 1}`}
                  className="btn btn-circle absolute top-1/2 right-0"
                >
                  ❯
                </a>
              )}
              <span className="absolute bottom-0 inset-x-1/2">
                {`${index + 1}/${post.canvasImg.length}`}
              </span>
            </div>
          ))}
        </div>
        <div className="divider divider-neutral"></div>
        <section className="mb-5">
          {comments.length === 0 ? (
            <h1>該貼文尚無評論</h1>
          ) : (
            comments?.map((eachcomment, index) => (
              <article className="flex mb-4" key={`${index}-${eachcomment.id}`}>
                <div className="avatar relative items-center flex-col mr-4">
                  {eachcomment.avatar !== "" ? (
                    <div className="w-20 rounded-full">
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
                  <span className="text-slate-400">{eachcomment.username}</span>
                </div>
                <div className="divider divider-horizontal"></div>
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: eachcomment.comment }}
                ></div>
              </article>
            ))
          )}
        </section>
        <section>
          <h2>留下你的評論：</h2>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={quillValue}
            onChange={setQuillValue}
          ></ReactQuill>
          <button
            className="btn btn-active btn-neutral mt-2"
            onClick={handleSaveComment}
          >
            儲存
          </button>
        </section>
      </div>
    </dialog>
  );
}

function UserProfileDialog({ posts, selectedUserData, currentUser }) {
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
        <article className="flex flex-wrap gap-2">
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
                      className="max-w-full max-h-[100px]"
                      src={eachpost.photos[0]}
                      alt="post_photo"
                    />
                  )}
                </figure>
                <div className="card-body">
                  <button
                    onClick={() => onNavigateClick(eachpost)}
                    className={"card-title"}
                  >
                    {eachpost.title}
                    <div className="badge bg-[#8da9c4] text-black">
                      {eachpost.isPublic ? "公開" : "私人"}
                    </div>
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
        </article>
      </div>
    </dialog>
  ) : (
    <></>
  );
}
