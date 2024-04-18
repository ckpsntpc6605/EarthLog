import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getPublicPosts } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";

export default function Forum() {
  const [publicPosts, setPublicPosts] = useState([]);
  const { setUserCurrentClickedPost } = usePostData();

  const navigate = useNavigate();

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

  function onNavigateClick(postdata) {
    setUserCurrentClickedPost(postdata);
    navigate(`/post/${postdata.id}`);
  }

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] h-full flex flex-col p-5">
      <article className="flex flex-wrap">
        {publicPosts?.map((eachpost) => (
          <div className="card w-96 bg-base-100 shadow-xl mb-3">
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
                  document.getElementById("PostDialog").showModal()
                }
              >
                {eachpost.title}
                <div className="badge badge-secondary">
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
        ))}
      </article>
    </main>
  );
}

function PostDialog({ post }) {
  return (
    <dialog id="PostDialog" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h1 className="font-bold text-lg">{post.destination}</h1>
        <h2>{post.title}</h2>
        <section dangerouslySetInnerHTML={{ __html: post.content }}></section>
      </div>
    </dialog>
  );
}