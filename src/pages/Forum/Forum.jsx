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
} from "../../utils/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storeComment } from "../../utils/firebase";

export default function Forum() {
  const { currentUser } = usePostData();
  const [publicPosts, setPublicPosts] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({
    avatar: "",
    email: "",
    id: "",
    username: "",
  });

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

  async function showSelectedUserProfile(authorID) {
    try {
      const userData = await getSelectedUserProfile(authorID);
      await setSelectedUserData(userData);
      await document.getElementById("UserProfileDialog").showModal();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className="bg-[#2b2d42] min-h-full h-auto flex flex-col p-5 relative">
      <article className="flex flex-wrap">
        {publicPosts?.map((eachpost) => (
          <div
            className="card w-96 bg-base-100 shadow-xl mb-3"
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
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
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
                className={"card-title"}
                onClick={() =>
                  document.getElementById(`${eachpost.id}`).showModal()
                }
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
            <PostDialog post={eachpost} currentUser={currentUser} />
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

function PostDialog({ post, currentUser }) {
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
    <dialog id={post.id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h1 className="font-bold text-3xl">{post.destination}</h1>
        <h2 className="text-xl">標題：{post.title}</h2>
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="border min-h-[100px] mb-4"
        ></article>
        <div>
          {post?.canvasImg?.map((perimg, index) => (
            <div
              dangerouslySetInnerHTML={{ __html: perimg }}
              className="bg-white w-full border mb-3"
              key={index}
            />
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
          <button onClick={handleSaveComment}>儲存</button>
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

  // useEffect(() => {
  //   const fetchFollowingUsers = async () => {
  //     try {
  //       const users = await getFollowingUsers(currentUser.id);
  //       setIsFollowing(users.some((user) => user.id === selectedUserData.id));
  //       setFollowingUsers(users);
  //     } catch (error) {
  //       console.error("Error fetching following users:", error);
  //     }
  //   };

  //   fetchFollowingUsers();
  // }, []);

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
    <dialog id="UserProfileDialog" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="avatar relative items-center w-full">
          {selectedUserData.avatar !== "" ? (
            <div className="w-24 rounded-full">
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

          <span className="text-slate-400 mr-auto">
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
        <article className="flex flex-wrap">
          {selectedUserPosts.length !== 0 ? (
            selectedUserPosts?.map((eachpost) => (
              <div
                className="card w-80 bg-base-100 shadow-xl mb-3"
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

//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
//取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注 取消關注
