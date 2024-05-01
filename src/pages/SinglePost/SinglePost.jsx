import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import { updatePostIsPublic } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import { NotebookPen, MapPinned, BookText } from "lucide-react";
import Carousel from "../../components/Carousel/Carousel";

export default function SinglePost() {
  const { userPostData, userCurrentClickedPost } = usePostData();
  const [isPublic, setIsPublic] = useState(
    userCurrentClickedPost ? userCurrentClickedPost.isPublic : null
  );
  const [currentPost, setCurrentPost] = useState(null);
  const currentUser = useAuthListener();
  const { id } = useParams();

  useEffect(() => {
    const post = userPostData?.find((post) => post.id === id);
    setCurrentPost(post);
  }, [userPostData]);
  function handlePublicPost(boolean) {
    updatePostIsPublic(currentUser.id, userCurrentClickedPost.id, boolean);
    setIsPublic(boolean);
  }
  // bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)]
  // bg-[url('/images/paperboard-texture.jpg')] bg-cover bg-center bg-no-repeat
  return (
    <main className="bg-[#2b2d42] h-auto flex flex-col p-5 relative">
      {currentPost ? (
        <>
          <h2 className="text-[24px] text-gray-200 mb-6">
            {currentPost.title}
          </h2>
          <div className="bg-[#A3ACB1] p-2 shadow-[10px_-10px_0px_rgba(68,90,102,0.7)]">
            <div className="flex items-center mb-2">
              <MapPinned size={20} />
              <span className="text-[20px] text-[#22223b] mr-auto">
                {currentPost.destination}
              </span>
              <span>{currentPost.date}</span>
            </div>
            <div className="">
              {currentPost.photos?.map((photo, index) => (
                <div key={index} className="w-full  shadow-lg shadow-gray-400">
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full rounded-md shadow-lg"
                  />
                </div>
              ))}
            </div>
            <section
              className="text-[24px] text-zinc-800 min-h-[400px] leading-[1.5] p-2 mb-3 indent-8"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            ></section>
            <button
              className="btn btn-ghost hover:outline hover:outline-1 btn-sm px-1"
              onClick={() => document.getElementById("canvasImgs").showModal()}
            >
              <BookText className="cursor-pointer" color="#7a4e00" />
            </button>
          </div>

          <dialog id="canvasImgs" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-30">
                  ✕
                </button>
              </form>
              <Carousel imgs={currentPost.canvasImg} />
            </div>
          </dialog>
          <div className="dropdown dropdown-left absolute right-2 top-4">
            <div tabIndex={0} role="button" className="btn m-1 btn-sm p-1">
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
                class="lucide lucide-ellipsis-vertical"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu shadow bg-base-100 rounded-md w-[100px]"
            >
              {isPublic !== null && (
                <li>
                  {isPublic ? (
                    <button
                      className="text-red-600 p-1 hover:ring-1 hover:ring-slate-500"
                      onClick={() => handlePublicPost(false)}
                    >
                      取消發布
                    </button>
                  ) : (
                    <button
                      className="p-1 hover:ring-1 hover:ring-slate-500"
                      onClick={() => handlePublicPost(true)}
                    >
                      發布
                    </button>
                  )}
                </li>
              )}
              <li>
                <Link
                  to={`/edit/${currentPost.id}`}
                  className="p-1 hover:ring-1 hover:ring-slate-500"
                >
                  編輯
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <p className="text-white">找不到該貼文</p>
      )}
    </main>
  );
}
