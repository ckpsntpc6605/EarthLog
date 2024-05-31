import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updatePost } from "../../utils/firebase";
import SelectImageButton from "../../components/Button/Button";
import DestinationInput, {
  TitleInput,
} from "../../components/Input/input_text";
import Canvas from "../../components/Canvas/Canvas";
import { NotebookPen, Trash2 } from "lucide-react";
import useGetCurrentUserPosts from "../../utils/hooks/useFirestoreData";
import useAuthListener from "../../utils/hooks/useAuthListener";

export default function ReEdit() {
  const { id } = useParams(); //postID
  const navigate = useNavigate();
  //The reason that don't use userCurrentClickedPost is because that if user turn off popup, the userCurrentClickedPost will be null
  const userPostData = useGetCurrentUserPosts();
  const [currentPost, setCurrentPost] = useState(null);
  const [canvasImg, setCanvasImg] = useState([]);
  const [inputValue, setInputValue] = useState({
    destination: "",
    title: "",
    date: "",
  });
  const [quillValue, setQuillValue] = useState("");
  const [images, setImages] = useState([]);
  const [updateResult, setUpdateResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAuthListener();

  useEffect(() => {
    const post = userPostData?.find((post) => post.id === id);
    setCurrentPost(post);
  }, [userPostData]);

  useEffect(() => {
    if (Object.keys(currentUser).length === 0 || !currentPost) return;
    setQuillValue(currentPost.content);
    setInputValue({
      destination: currentPost.destination,
      title: currentPost.title,
      date: currentPost.date,
    });
    setImages(currentPost.photos);
    const updatedCanvasImg = currentPost.canvasImg.map((data) => ({
      data,
      id: data,
    })); //only have url,no id ,so create an id first
    setCanvasImg(updatedCanvasImg);
  }, [currentPost]);
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
    setImages(imageFiles);
  }

  async function handleUpdatePost() {
    try {
      const canvasImgData = canvasImg.map((item) => item.data); //只取data，不取到id，不然firebase儲存時候出錯
      setIsLoading(true);
      const postData = {
        ...inputValue,
        content: quillValue,
        id: currentPost.id,
        coordinates: currentPost.coordinates,
        author: currentPost.author,
        authorID: currentPost.authorID,
        isPublic: currentPost.isPublic,
      };
      const { result, postDataID } = await updatePost(
        postData,
        images,
        canvasImgData
      );
      setUpdateResult({ result, postDataID });
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
    if (updateResult === null) return;
    setUpdateResult(null);
    navigate(`/post/${currentPost.id}`);
  }, [updateResult]);

  const [showCanvas, setShowCanvas] = useState("hidden");
  function handleShowCanvas() {
    showCanvas === "hidden" ? setShowCanvas("block") : setShowCanvas("hidden");
  }

  function handleDeleteCanvasImg(imgID) {
    setCanvasImg((prevImgs) =>
      prevImgs.filter((eachImg) => eachImg.id !== imgID)
    );
  }

  return (
    <div className="flex flex-col h-fit items-center bg-[#F0F5F9] p-4 rounded-b-lg">
      {currentPost && (
        <div className="w-11/12 my-4 bg-[rgba(60,60,60,0.5)] min-h-[200px] relative rounded-md">
          {images.length !== 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-full p-2 bg-white">
                <img
                  src={image.type ? URL.createObjectURL(image) : image}
                  alt="content image"
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
      )}

      <main className="bg-[#F0F5F9] h-auto flex flex-col p-5 relative">
        {currentPost && (
          <>
            <form className="bg-[#d0dbe8] border border-white mb-3 p-3 rounded-md shadow-[_4px_4px_4px_rgba(0,0,0,.2)]">
              <DestinationInput
                handleChange={handleChange}
                value={inputValue.destination}
              />
              <TitleInput
                handleChange={handleChange}
                value={inputValue.title}
              />
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
              ></ReactQuill>
            </div>

            <div className="divider divider-neutral"></div>
            <h2 className="flex items-center gap-2 text-[#52616B]">
              編輯相簿
              <NotebookPen
                className="cursor-pointer"
                color="#52616B"
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
                  <div
                    key={`${eachImg.data}_${eachImg.id}`}
                    className="relative"
                  >
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
            <div className="flex justify-end">
              <button
                className="btn btn-sm text-md text-[#52616B] bg-[#C9D6DF] self-end mt-3 mr-3 border-none rounded-xl hover:bg-[#1E2022] hover:text-[#F0F5F9]"
                onClick={() =>
                  document.getElementById("cancelModal").showModal()
                }
              >
                取消
              </button>
              <button
                className="btn btn-sm text-md text-[#52616B] bg-green-600 self-end mt-3 border-none  rounded-xl hover:bg-[#1E2022] hover:text-[#F0F5F9]"
                onClick={() =>
                  document.getElementById("storeModal").showModal()
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "儲存"
                )}
              </button>
            </div>

            {updateResult !== null ? (
              updateResult.result ? (
                <UpdateResultMessage
                  result={updateResult.result}
                  msg={"更新成功！正在為您跳轉"}
                />
              ) : (
                <UpdateResultMessage
                  result={updateResult.result}
                  msg={"更新失敗...請聯繫客服"}
                />
              )
            ) : (
              <></>
            )}
          </>
        )}
      </main>
      <dialog id="storeModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-xl">確定要儲存嗎？</h3>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm mr-3 bg-[#C9D6DF] border-none text-[#34373b] hover:bg-[#1E2022] hover:text-[#F0F5F9]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "取消"
                )}
              </button>
              <button
                className="btn btn-sm text-md bg-green-600 border-none text-[#34373b] hover:bg-[#1E2022] hover:text-[#F0F5F9]"
                onClick={handleUpdatePost}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "確定更新"
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="cancelModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            取消不會儲存已更新的部分，確定取消嗎？
          </h3>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm mr-3 bg-[#C9D6DF] border-none  text-[#34373b] hover:text-[#F0F5F9]">
                不，我再想想
              </button>
              <button
                className="btn btn-sm  bg-rose-600 border-none text-[#34373b] hover:text-[#F0F5F9]"
                onClick={() => {
                  navigate(`/post/${currentPost.id}`);
                }}
              >
                確定
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function UpdateResultMessage({ result, msg }) {
  if (result) {
    return (
      <div className="toast toast-top toast-center z-20">
        <div className="alert bg-green-100 border-green-100 text-green-600 font-semibold shadow-lg">
          <span>{msg}</span>
        </div>
      </div>
    );
  } else if (result === "failure") {
    <div className="toast toast-top toast-center z-20">
      <div className="alert bg-red-200 border-red-200 text-red-600 font-semibold shadow-lg">
        <span>{msg}</span>
      </div>
    </div>;
  } else {
    return null;
  }
}
