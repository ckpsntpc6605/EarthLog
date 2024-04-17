import React from "react";
import { useParams } from "react-router-dom";
import { usePostData } from "../../context/dataContext";

export default function SinglePost() {
  const { userPostData } = usePostData();
  const { id } = useParams();
  const post = userPostData.find((post) => post.id === id);

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
    </main>
  );
}
