import React from "react";
import { usePostData } from "../../context/dataContext";
import { Link } from "react-router-dom";

export default function Post() {
  const { userPostData } = usePostData();

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] min-h-full h-auto flex flex-col p-5 relative">
      {userPostData?.map((eachpost) => (
        <ul
          className="menu menu-md bg-base-200 w-56 rounded-box shadow-md shadow-indigo-900 mb-4"
          key={eachpost.id}
        >
          <li>
            <div className="menu-title flex items-center">
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
                className="lucide lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{eachpost.author}</span>
            </div>
            <ul>
              <li>
                <Link to={`/post/${eachpost.id}`}>{eachpost.title}</Link>
              </li>
            </ul>
          </li>
          {eachpost.photos.length > 0 && (
            <img src={eachpost.photos[0]} alt="post-photo" />
          )}
        </ul>
      ))}

      {/* <h1 className="text-[40px] text-white">
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
      <section></section> */}
    </main>
  );
}
