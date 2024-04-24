import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
export default function ReEdit() {
  const { id } = useParams(); //postID
  //不用userCurrentClickedPost是因為user把popup關掉的話，userCurrentClickedPost會變null
  const { userPostData } = usePostData();
  const [currentPost, setCurrentPost] = useState(null);
  useEffect(() => {
    const post = userPostData?.find((post) => post.id === id);
    setCurrentPost(post);
  }, [userPostData]);

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
  useEffect(() => {
    if (!currentPost) return;
    setQuillValue(currentPost.content);
  }, [currentPost]);
  const [images, setImages] = useState([]);
  const [isStoreSuccess, setIsStoreSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "formula"],

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

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
        canvasImg,
      };
      await storePost(postData, images, currentUser.id);
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
  const [showCanvas, setShowCanvas] = useState("hidden");
  function handleShowCanvas() {
    showCanvas === "hidden" ? setShowCanvas("block") : setShowCanvas("hidden");
  }

  return (
    <main className="bg-gradient-to-b from-[rgba(29,2,62,0.95)] to-[rgba(59,50,160,0.95)] min-h-full h-auto flex flex-col p-5 relative">
      {currentPost && (
        <>
          <DestinationInput
            handleChange={handleChange}
            value={currentPost.destination}
          />
          <TitleInput handleChange={handleChange} value={currentPost.title} />
          <input
            type="date"
            id="datePicker"
            className="py-1 px-2 rounded-lg self-end bg-inherit text-gray-500 ring-1 ring-slate-500 mb-2"
            value={currentPost.date}
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
          <NotebookPen
            className="cursor-pointer text-white"
            onClick={handleShowCanvas}
          />
          <div
            className={`${showCanvas} fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 p-3`}
          >
            <Canvas
              handleShowCanvas={handleShowCanvas}
              setCanvasJson={setCanvasJson}
              setCanvasImg={setCanvasImg}
              canvasImg={canvasImg}
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {canvasImg &&
              canvasImg.map((eachImg, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: eachImg }}
                  className="bg-white"
                />
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
        </>
      )}
    </main>
  );
}
