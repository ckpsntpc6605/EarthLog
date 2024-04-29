import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import { updatePostIsPublic } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import { NotebookPen } from "lucide-react";

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
  return (
    <main className="bg-[#2b2d42] min-h-full h-auto flex flex-col p-5 relative bg-[url('/images/paperboard-texture.jpg')] bg-cover bg-center bg-no-repeat">
      {currentPost ? (
        <>
          <div className="p-2">
            {currentPost.photos?.map((photo, index) => (
              <div
                key={index}
                className="w-full p-2 bg-amber-100 shadow-lg shadow-gray-400"
              >
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <h1 className="text-[32px] text-gray-500">
            地點：{currentPost.destination}
          </h1>
          <h2 className="text-[24px] text-gray-500 mb-2">
            標題：{currentPost.title}
          </h2>
          <section
            className="text-[24px] text-zinc-800 min-h-[400px] leading-[1.5]  bg-[url('/images/paperboard-texture.jpg')] bg-cover bg-center bg-no-repeat p-2 mb-3 indent-8"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          ></section>

          <button
            className="btn btn-ghost self-end hover:outline hover:outline-1 btn-sm px-1"
            onClick={() => document.getElementById("canvasImgs").showModal()}
          >
            <NotebookPen className="cursor-pointer " />
          </button>
          <dialog id="canvasImgs" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-30">
                  ✕
                </button>
              </form>
              <div className="carousel w-full">
                {currentPost?.canvasImg?.map((eachImg, index) => (
                  <div
                    key={`slide-${index}`}
                    id={`slide-${index}`}
                    className="carousel-item relative w-full"
                  >
                    <div>
                      <img src={eachImg} alt="2" />
                    </div>
                    {index !== 0 && (
                      <a
                        href={`#slide-${index - 1}`}
                        className="btn btn-circle absolute top-1/2 left-0"
                      >
                        ❮
                      </a>
                    )}
                    {index !== currentPost.canvasImg.length - 1 && (
                      <a
                        href={`#slide-${index + 1}`}
                        className="btn btn-circle absolute top-1/2 right-0"
                      >
                        ❯
                      </a>
                    )}
                    <span className="absolute bottom-0 inset-x-1/2">
                      {`${index + 1}/${currentPost.canvasImg.length}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </dialog>
          <div className="dropdown dropdown-left absolute right-2 top-6">
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
