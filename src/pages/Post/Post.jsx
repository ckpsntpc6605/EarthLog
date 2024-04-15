import React from "react";
import { usePostData } from "../../context/dataContext";

export default function Post() {
  const { notSavedPoint, userCurrentClickedPost } = usePostData();

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] h-full flex flex-col p-5">
      <h1 className="text-[40px] text-white">
        旅遊地點：
        {userCurrentClickedPost ? userCurrentClickedPost.destination : null}
      </h1>
      <h2 className="text-[32px] text-white">
        標題：{userCurrentClickedPost ? userCurrentClickedPost.title : null}
      </h2>
      <section
        className="text-[24px] text-white border"
        dangerouslySetInnerHTML={{
          __html: userCurrentClickedPost
            ? userCurrentClickedPost.content
            : null,
        }}
      ></section>
    </main>
  );
}
