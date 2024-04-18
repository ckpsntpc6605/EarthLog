import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import { updatePostIsPublic } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";

export default function SinglePost() {
  const { userPostData, userCurrentClickedPost } = usePostData();
  const [isPublic, setIsPublic] = useState(null);

  useEffect(() => {
    if (!userCurrentClickedPost) return;
    setIsPublic(userCurrentClickedPost.isPublic);
  }, [userPostData, userCurrentClickedPost]);

  const currentUser = useAuthListener();
  const { id } = useParams();

  const post = userPostData.find((post) => post.id === id);

  function handlePublicPost(boolean) {
    updatePostIsPublic(currentUser.id, userCurrentClickedPost.id, boolean);
    setIsPublic(boolean);
  }
  console.log(isPublic);
  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] min-h-full h-auto flex flex-col p-5 relative bg-[url('/images/paperboard-texture.jpg')] bg-cover bg-center bg-no-repeat">
      {post ? (
        <>
          <h1 className="text-[32px] text-gray-500">
            地點：{post.destination}
          </h1>
          <h2 className="text-[24px] text-gray-500">標題：{post.title}</h2>
          <section
            className="text-[24px] text-zinc-800 border min-h-[400px] leading-[1.5]  bg-[url('/images/paperboard-texture.jpg')] bg-cover bg-center bg-no-repeat p-2 mb-3   indent-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></section>
          <div className="flex flex-wrap gap-2">
            {post.photos?.map((photo, index) => (
              <div
                key={index}
                className="w-[47%] p-2 bg-amber-100 shadow-lg shadow-gray-400"
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
        </>
      ) : (
        <p className="text-white">找不到該貼文</p>
      )}

      <div className="dropdown dropdown-left absolute right-2 top-6">
        <div tabIndex={0} role="button" className="btn m-1 btn-sm p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
          {isPublic !== undefined ? (
            isPublic ? (
              <li>
                <button
                  className="text-red-600 p-1 hover:ring-1 hover:ring-slate-500"
                  onClick={() => handlePublicPost(false)}
                >
                  取消發布
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="p-1 hover:ring-1 hover:ring-slate-500"
                  onClick={() => handlePublicPost(true)}
                >
                  發布
                </button>
              </li>
            )
          ) : null}
        </ul>
      </div>
    </main>
  );
}
