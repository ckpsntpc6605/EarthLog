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
import useAuthListener from "../../utils/hooks/useAuthListener";
import Canvas from "../../components/Canvas/Cnavas";
import { NotebookPen } from "lucide-react";

export default function Edit() {
  const [cnavasJson, setCanvasJson] = useState({});
  const [canvasImg, setCanvasImg] = useState([]);
  const navigate = useNavigate();
  const currentUser = useAuthListener();
  const { notSavedPoint } = usePostData();
  const [inputValue, setInputValue] = useState({
    destination: "",
    title: "",
    date: "",
  });
  const [quillValue, setQuillValue] = useState("");
  const [images, setImages] = useState([]);
  const [isStoreSuccess, setIsStoreSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState("hidden");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["link", "image"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ header: [1, 2, 3, 4, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
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
    setImages([...imageFiles]);
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
      await storePost(postData, images, currentUser.id, canvasImg);
      setIsStoreSuccess("success");
      setImages([]);
      navigate(`/`);
    } catch (e) {
      console.log(e);
      setIsStoreSuccess("failure");
    } finally {
      setQuillValue("");
      setInputValue({
        destination: "",
        title: "",
        value: "",
      });
      setIsLoading(false);
      setTimeout(() => {
        setIsStoreSuccess(null);
      }, 3000);
    }
  }

  function StoreStatusMessage({ status }) {
    if (status === "success") {
      return (
        <div className="toast toast-top toast-center z-20">
          <div className="alert alert-success">
            <span>儲存成功</span>
          </div>
        </div>
      );
    } else if (status === "failure") {
      <div className="toast toast-top toast-center z-20">
        <div className="alert alert-warning">
          <span>儲存失敗，請洽客服</span>
        </div>
      </div>;
    } else {
      return null; // 如果状态不是成功或失败，则不显示消息
    }
  }

  function handleShowCanvas() {
    showCanvas === "hidden" ? setShowCanvas("block") : setShowCanvas("hidden");
  }
  console.log(images);
  return (
    <div>
      <div className="w-full bg-[rgba(60,60,60,0.5)] min-h-[200px] relative ">
        {images.length !== 0 ? (
          images.map((image, index) => (
            <div key={index} className="w-full p-2 bg-white">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded Image ${index + 1}`}
                className="w-full"
              />
            </div>
          ))
        ) : (
          <span className="text-gray-100 absolute trnasfrom -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            選擇你自己的封面
          </span>
        )}

        <SelectImageButton handleImageChange={handleImageChange} />
      </div>
      <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] min-h-full h-auto flex flex-col p-5 relative">
        <form className="bg-[rgb(0,0,0,0.3)] border border-white mb-3 p-3 rounded-md">
          <DestinationInput
            handleChange={handleChange}
            value={inputValue.destination}
          />
          <TitleInput handleChange={handleChange} value={inputValue.title} />
          <div>
            <label htmlFor="datePicker" className="text-gray-400">
              日期：
            </label>
            <input
              type="date"
              id="datePicker"
              className="py-1 px-2 rounded-lg self-end bg-[rgba(50,50,50,.5)] text-gray-500 ring-1 ring-slate-500 mb-2 border-gray-400 focus:border-white"
              value={inputValue.date}
              onChange={(e) =>
                handleChange({
                  target: { name: "date", value: e.target.value },
                })
              }
            />
          </div>
        </form>
        <ReactQuill
          theme="snow"
          modules={modules}
          value={quillValue}
          onChange={setQuillValue}
          className={` bg-white rounded-lg`}
        ></ReactQuill>
        <div className="divider divider-neutral"></div>
        <h2 className="text-zinc-300 flex items-center gap-2">
          編輯相簿
          <NotebookPen
            className="cursor-pointer text-white"
            onClick={handleShowCanvas}
          />
        </h2>
        <div
          className={`${showCanvas} fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 p-3  bg-yellow-200 rounded-lg`}
        >
          <Canvas
            handleShowCanvas={handleShowCanvas}
            setCanvasJson={setCanvasJson}
            setCanvasImg={setCanvasImg}
            canvasImg={canvasImg}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-4 rounded-lg">
          {canvasImg &&
            canvasImg.map((eachImg, index) => (
              // <div
              //   key={index}
              //   dangerouslySetInnerHTML={{ __html: eachImg }}
              //   className="bg-white"
              // />
              <img src={eachImg} alt="" key={index} className="rounded-md" />
            ))}
        </div>
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
    </div>
  );
}
