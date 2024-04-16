import React from "react";
import { useParams } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import useFirestoreData from "../../utils/hooks/useFirestoreData";

export default function SinglePost() {
  const { userPostData } = usePostData();
  const { id } = useParams();
  const post = userPostData.find((post) => post.id === id);

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] h-full flex flex-col p-5">
      {post ? (
        <>
          <h1 className="text-[40px] text-white">{post.title}</h1>
          <section
            className="text-[24px] text-white border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></section>
        </>
      ) : (
        <p className="text-white">找不到該貼文</p>
      )}
    </main>
  );
}
