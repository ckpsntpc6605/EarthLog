import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storePost } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import SelectImageButton from "../../components/Button/Button";
import DestinationInput, {
  TitleInput,
} from "../../components/Input/input_text";

export default function Edit() {
  const navigate = useNavigate();

  const { notSavedPoint } = usePostData();
  const [inputValue, setInputValue] = useState({
    destination: "",
    title: "",
    date: "",
  });
  const [quillValue, setQuillValue] = useState("");
  const [images, setImages] = useState([]);
  const [isStoreSuccess, setIsStoreSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setImages((prevfiles) => [...prevfiles, ...imageFiles]);
  }
  async function handleSavePost() {
    try {
      setIsLoading(true);
      const postData = {
        ...inputValue,
        content: quillValue,
        id: notSavedPoint.id,
        coordinates: notSavedPoint.geometry.coordinates,
      };
      await storePost(postData, images);
      setQuillValue("");
      setInputValue({
        destination: "",
        title: "",
        value: "",
      });
      setIsStoreSuccess("success");
      setImages([]);
      if (isStoreSuccess === "success") {
        navigate(`/post`);
      }
    } catch (e) {
      console.log(e);
      setIsStoreSuccess("failure");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsStoreSuccess(null);
      }, 3000);
    }
  }

  function StoreStatusMessage({ status }) {
    if (status === "success") {
      return (
        <div className="toast toast-start">
          <div className="alert alert-success">
            <span>儲存成功</span>
          </div>
        </div>
      );
    } else if (status === "failure") {
      <div className="toast toast-start">
        <div className="alert alert-warning">
          <span>儲存失敗，請洽客服</span>
        </div>
      </div>;
    } else {
      return null; // 如果状态不是成功或失败，则不显示消息
    }

    // return (
    //   <div className="bg-slate-900 text-white py-2 px-3 absolute inset-1/2 opacity-30 w-[30%] h-[40px]">
    //     {message}
    //   </div>
    // );
  }

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] min-h-full h-auto flex flex-col p-5 relative">
      <DestinationInput
        handleChange={handleChange}
        value={inputValue.destination}
      />
      <TitleInput handleChange={handleChange} value={inputValue.title} />
      <input
        type="date"
        id="datePicker"
        className="py-1 px-2 rounded-lg self-end bg-inherit text-gray-500 ring-1 ring-slate-500 mb-2"
        value={inputValue.date}
        onChange={(e) =>
          handleChange({ target: { name: "date", value: e.target.value } })
        }
      />
      <ReactQuill
        theme="snow"
        modules={modules}
        value={quillValue}
        onChange={setQuillValue}
        className={`text-white`}
      ></ReactQuill>
      <div className="divider divider-neutral"></div>
      <h2 className="text-zinc-500">選擇相片</h2>
      <SelectImageButton handleImageChange={handleImageChange} />
      <div className="flex flex-wrap gap-2">
        {images?.map((image, index) => (
          <div key={index} className="w-[47%] p-2 bg-white">
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Uploaded Image ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div className="divider divider-neutral"></div>
      <button
        className="bg-violet-600 text-violet-950 text-xl self-end py-3 px-5 rounded-xl"
        onClick={handleSavePost}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          "儲存"
        )}
      </button>
      <StoreStatusMessage status={isStoreSuccess} />
    </main>
  );
}
