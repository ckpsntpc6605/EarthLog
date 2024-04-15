import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storePost } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import uploadImageFetch from "../../utils/uploadImageFetch";

export default function Edit() {
  const { notSavedPoint } = usePostData();
  const [inputValue, setInputValue] = useState({
    destination: "",
    title: "",
  });
  const [quillValue, setQuillValue] = useState("");
  const [images, setImages] = useState([]);
  const [isStoreSuccess, setIsStoreSuccess] = useState("");

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
      [("link", "image")],
      ["clean"],
    ],
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setInputValue((prevvalue) => ({
      ...prevvalue,
      [name]: value,
    }));
  }
  function handleImageChange(e) {
    const fileList = e.target.files;
    const imageFiles = Array.from(fileList);
    setImages(imageFiles);
  }
  async function handleStorePost() {
    try {
      const postData = {
        ...inputValue,
        content: quillValue,
        id: notSavedPoint.id,
        coordinates: notSavedPoint.geometry.coordinates,
      };
      await storePost(postData);
      setQuillValue("");
      setInputValue({
        destination: "",
        title: "",
      });
      setIsStoreSuccess("success");
    } catch (e) {
      console.log(e);
      setIsStoreSuccess("failure");
    } finally {
      setTimeout(() => {
        setIsStoreSuccess(null);
      }, 3000);
    }
  }

  function StoreStatusMessage({ status }) {
    let message;
    if (status === "success") {
      message = "儲存成功";
    } else if (status === "failure") {
      message = "儲存失敗...請洽客服人員";
    } else {
      return null; // 如果状态不是成功或失败，则不显示消息
    }

    return (
      <div className="bg-slate-900 text-white py-2 px-3 absolute inset-1/2 opacity-30 w-[30%] h-[40px]">
        {message}
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] h-full flex flex-col p-5 relative">
      <div className="text-white font-bold text-[40px] mb-[15px]">
        <label htmlFor="destination">
          旅行地點:
          <input
            type="text"
            name="destination"
            id="destination"
            className="outline-none bg-inherit pl-5 border-solid border-gray-500 border-b"
            onChange={handleChange}
            value={inputValue.destination}
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
            onChange={handleChange}
            value={inputValue.title}
          />
        </label>
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={quillValue}
        onChange={setQuillValue}
        className={`text-white`}
      ></ReactQuill>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple // 允许用户选择多张图片
        className="mt-[70px]"
      />
      <div className="flex flex-wrap">
        {images?.map((image, index) => (
          <div key={index} className="w-1/2 px-2 bg-white">
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Uploaded Image ${index + 1}`}
              className="w-full mt-5"
            />
          </div>
        ))}
      </div>

      <button
        className="mt-[70px] bg-violet-600 text-violet-950 text-xl self-end py-3 px-5 rounded-xl"
        onClick={handleStorePost}
      >
        儲存
      </button>
      <StoreStatusMessage status={isStoreSuccess} />
    </main>
  );
}
