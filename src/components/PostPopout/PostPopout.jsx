import React from "react";

export default function PostPopout({ title, country, author }) {
  return (
    <>
      <header class="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
        <h3 class="text-[20px] text-bold text-white">{title}</h3>
      </header>
      <div className="mb-2 mx-3">
        <span className="text-[#6c6c6c] text-[20px]">{country}</span>
      </div>
      <div class="flex justify-between mb-2 mx-3">
        <div>
          <span class="text-[#ACACAC] text-[14px]">{author}</span>
        </div>
        <button class="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4">
          See More
        </button>
      </div>
    </>
  );
}
