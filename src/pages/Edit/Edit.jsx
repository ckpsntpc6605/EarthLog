import React, { useEffect, useRef, useState } from "react";
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
import { NotebookPen, Trash2 } from "lucide-react";

export default function Edit() {
  const [canvasImg, setCanvasImg] = useState([]);
  const navigate = useNavigate();
  const currentUser = useAuthListener();
  const { notSavedPoint, setNotSavedPoint } = usePostData();
  const [inputValue, setInputValue] = useState({
    destination: "",
    title: "",
    date: "",
  });
  const [quillValue, setQuillValue] = useState("");
  const [images, setImages] = useState([]);
  const [storeResult, setStoreResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState("hidden");
  const [hovered, setHovered] = useState(false);

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
    setImages(imageFiles);
  }

  async function handleSavePost() {
    try {
      const canvasImgData = canvasImg.map((item) => item.data); //只取data，不取到id，不然firebase儲存時候出錯
      setIsLoading(true);

      const postData = {
        ...inputValue,
        content: quillValue,
        id: notSavedPoint.id,
        coordinates: notSavedPoint.geometry.coordinates,
      };
      const { result, postDataID } = await storePost(
        postData,
        images,
        currentUser.id,
        canvasImgData
      );
      setStoreResult({ result, postDataID });
    } catch (e) {
      console.log(e);
    } finally {
      setImages([]);
      setQuillValue("");
      setInputValue({
        destination: "",
        title: "",
        value: "",
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let timer;
    if (storeResult && storeResult.result && storeResult.postDataID) {
      timer = setTimeout(() => {
        setStoreResult(null);
        setNotSavedPoint(null); //關掉地圖上的編輯點
        navigate(`/post/${storeResult.postDataID}`);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [storeResult]);

  useEffect(() => {
    if (!notSavedPoint) {
      alert("請先標記地點！");
      navigate("/");
    }
  }, [notSavedPoint]);

  function handleShowCanvas() {
    showCanvas === "hidden" ? setShowCanvas("block") : setShowCanvas("hidden");
  }

  function handleDeleteCanvasImg(imgID) {
    setCanvasImg((prevImgs) =>
      prevImgs.filter((eachImg) => eachImg.id !== imgID)
    );
  }

  const handleHover = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div className="flex flex-col grow items-center bg-[#F0F5F9] p-4 rounded-b-lg">
      <div
        className="w-11/12 my-4 bg-[rgba(60,60,60,0.5)] min-h-[200px] relative rounded-md cursor-pointer hover:bg-[rgba(60,60,60,0.8)] transition-colors"
        onClick={() => document.getElementById("fileInput").click()}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {images.length !== 0 ? (
          images.map((image, index) => (
            <div key={index} className="w-full p-2 bg-white">
              <img
                src={URL.createObjectURL(image)}
                alt="content image"
                className="w-full"
              />
            </div>
          ))
        ) : (
          <span className="text-gray-100 absolute trnasfrom -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            {hovered ? "點擊更換圖片" : "選擇你自己的封面"}
          </span>
        )}
        <SelectImageButton handleImageChange={handleImageChange} />
      </div>
      <main className="bg-[#F0F5F9] h-auto flex flex-col p-5 relative">
        <form className="bg-[#d0dbe8] border border-white mb-3 p-5 rounded-md shadow-[_4px_4px_4px_rgba(0,0,0,.2)]">
          <DestinationInput
            handleChange={handleChange}
            value={inputValue.destination}
          />
          <TitleInput handleChange={handleChange} value={inputValue.title} />
          <div className="mt-4">
            <label htmlFor="datePicker" className="text-[#1E2022]">
              日期：
            </label>
            <input
              type="date"
              id="datePicker"
              className="input input-bordered input-sm  max-w-xs focus:text-black focus:bg-[#e5e5e5] text-[#34373b] bg-transparent"
              value={inputValue.date}
              onChange={(e) =>
                handleChange({
                  target: { name: "date", value: e.target.value },
                })
              }
            />
          </div>
        </form>
        <div className="divider divider-neutral"></div>
        <div className="my-2">
          <p className="mb-2 tetx-[#52616B]">撰寫文章</p>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={quillValue}
            onChange={setQuillValue}
            className={` bg-white rounded-lg`}
          ></ReactQuill>
        </div>

        <div className="divider divider-neutral"></div>
        <h2 className="flex items-center gap-2 text-[#52616B] tracking-wider ">
          編輯相簿:
          <NotebookPen
            color="#52616B"
            className="cursor-pointer"
            onClick={handleShowCanvas}
          />
        </h2>
        <div
          className={`${showCanvas} fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 p-1 border border-[#bfc7d1] bg-white rounded-lg`}
        >
          <Canvas
            handleShowCanvas={handleShowCanvas}
            setCanvasImg={setCanvasImg}
            canvasImg={canvasImg}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4 rounded-lg">
          {canvasImg &&
            canvasImg.map((eachImg, index) => (
              <div key={`${eachImg.data}`} className="relative">
                <img
                  src={eachImg.data}
                  alt={`photograph_${index}`}
                  id={`${eachImg.id}_${eachImg.data}`}
                  className="rounded-md shadow-[_4px_4px_4px_rgba(0,0,0,.2)]"
                />
                <button
                  className="absolute top-2 right-2 hover:bg-[#1E2022] text-white rounded-lg p-2 transition-colors"
                  onClick={() => handleDeleteCanvasImg(eachImg.id)} // 呼叫處理刪除的函數，傳遞圖像的 ID
                >
                  <Trash2 size={20} color="#cccccc" />
                </button>
              </div>
            ))}
        </div>
        {/* <Carousel imgs={canvasImg} isModalOpen={true} /> */}
        <button
          className="btn text-md text-[#52616B] bg-[#C9D6DF] self-end mt-3 rounded-xl hover:bg-[#1E2022] hover:text-[#F0F5F9]"
          onClick={handleSavePost}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-dots loading-md "></span>
          ) : (
            "儲存"
          )}
        </button>
        <StoreStatusMessage storeResult={storeResult} />
      </main>
    </div>
  );
}

function StoreStatusMessage({ storeResult }) {
  if (!storeResult) return;
  if (storeResult.result) {
    return (
      <div className="toast toast-top toast-center z-20">
        <div className="alert  bg-white border-green-500 text-green-500 border-2">
          <span>儲存成功!正在為您跳轉</span>
        </div>
      </div>
    );
  } else if (!storeResult.result) {
    <div className="toast toast-top toast-center z-20">
      <div className="alert alert-warning">
        <span>儲存失敗，請洽客服。目前候位446位...</span>
      </div>
    </div>;
  } else {
    return null;
  }
}
