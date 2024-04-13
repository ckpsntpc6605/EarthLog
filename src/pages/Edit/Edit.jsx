import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PostPopout from "../../components/PostPopout/PostPopout";

export default function Edit() {
  const [quillValue, setQuillValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] h-full flex flex-col p-5">
      <div className="text-white font-bold text-[40px] mb-[15px]">
        <label htmlFor="destination">
          旅行地點:
          <input
            type="text"
            name="destination"
            id="destination"
            className="outline-none bg-inherit pl-5 border-solid border-gray-500 border-b"
          />
        </label>
      </div>

      <div className="text-white pb-5 text-[30px] font-semibold">
        <label htmlFor="title">
          標題:
          <input
            type="text"
            name="title"
            id="title"
            className="outline-none bg-inherit pl-5 border-solid border-gray-500 border-b"
          />
        </label>
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={quillValue}
        onChange={setQuillValue}
        className="text-white h-[500px]"
      />
    </main>
  );
}
