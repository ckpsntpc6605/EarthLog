import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useUserData,
  useGetSelectedUserPost,
} from "../../utils/hooks/useFirestoreData";
import { getSelectedUserProfile, getPostComments } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import ReactQuill from "react-quill";

export default function OtherUserProfile() {
  const { id } = useParams();
  const userPosts = useGetSelectedUserPost(id);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getSelectedUserProfile(id);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  return (
    <div>
      {userProfile && (
        <div className="avatar relative items-center w-full">
          {userProfile.avatar !== "" ? (
            <div className="w-24 rounded-full">
              <img src={userProfile.avatar} />
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

          <span className="text-slate-400 mr-auto">{userProfile.username}</span>
          <button className="btn">關注</button>
        </div>
      )}
      {userPosts && (
        <article className="flex flex-wrap">
          {userPosts.length !== 0 ? (
            userPosts?.map((eachpost) => (
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
                    className={"card-title text-left"}
                    onClick={() =>
                      document.getElementById(`${eachpost.id}`).showModal()
                    }
                  >
                    {eachpost.title}
                    <div className="badge badge-secondary min-w-[50px]">
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
                <PostDialog post={eachpost} />
              </div>
            ))
          ) : (
            <h2>該用戶尚無貼文</h2>
          )}
        </article>
      )}
    </div>
  );
}

function PostDialog({ post }) {
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
    <dialog id={post.id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h1 className="font-bold text-lg">{post.destination}</h1>
        <h2>{post.title}</h2>
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
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
