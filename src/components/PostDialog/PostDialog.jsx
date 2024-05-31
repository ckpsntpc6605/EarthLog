import { useState } from "react";
import useAuthListener from "../../utils/hooks/useAuthListener";
import { useUserData } from "../../utils/hooks/useFirestoreData";
import { useGetFireStoreDocs } from "../../utils/hooks/useFirestoreData";
import { MapPinned, Trash2 } from "lucide-react";
import Carousel from "../../components/Carousel/Carousel";
import ReactQuill from "react-quill";
import { deleteComment, storeComment } from "../../utils/firebase";

export default function PostDialog({
  post,
  selectedUserData,
  setSelectedPost,
}) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ align: [] }],
    ],
  };

  const currentUser = useAuthListener();

  const userData = useUserData(currentUser.id);
  const [quillValue, setQuillValue] = useState("");

  const commentPath = `users/${post.authorID}/post/${post.id}/comments`;
  const { data } = useGetFireStoreDocs(commentPath);
  const commentDatas = data;

  async function handleSaveComment() {
    if (quillValue === "") {
      alert("請先輸入文字");
      return;
    }
    try {
      const currentDate = new Date();
      const commentData = {
        ...userData,
        comment: quillValue,
        commentTime: currentDate.toISOString(),
      };
      await storeComment(post.authorID, post.id, commentData);
      setQuillValue("");
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDaleteComment(docID) {
    const path = `users/${post.authorID}/post/${post.id}/comments/${docID}`;
    try {
      const result = await deleteComment(path);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <dialog id="PostDialog" className="modal">
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setSelectedPost(null)}>close</button>
      </form>
      <div className="modal-box border p-8 text-white border-gray-400 bg-[rgba(0,0,0,0.7)] backdrop-blur-md relative w-11/12 max-w-5xl flex flex-col gap-4">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex items-center mb-3">
            <div className="font-bold text-sm flex gap-2 items-center">
              <MapPinned size={20} color="#f59e0b" />
              <span className="text-amber-500 mr-2">{post.destination} / </span>
            </div>
            <span className=""> {post.date}</span>
          </div>
          <div className="mr-auto mb-3">
            <h2 className="text-3xl mb-2 font-bold">{post.title}</h2>
          </div>
          {selectedUserData && (
            <div className="flex items-center gap-2">
              <div className="avatar relative size-[96px]">
                {selectedUserData.avatar !== "" ? (
                  <div className="w-24 rounded-full">
                    <img
                      src={selectedUserData.avatar}
                      className="rounded-full "
                    />
                  </div>
                ) : (
                  <div className="w-24 rounded-full relative bg-slate-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-xl">{selectedUserData.username}</span>
            </div>
          )}
        </header>
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="mb-4 p-2 leading-8 indent-4 tracking-wide text-white"
        ></article>
        <div className="divider divider-neutral"></div>
        <div className="flex justify-center w-1/2 self-center">
          {post.canvasImg.length === 0 ? (
            <span>該貼文無相簿</span>
          ) : (
            <Carousel imgs={post.canvasImg} />
          )}
        </div>
        <div className="divider divider-neutral"></div>
        <section className="mb-5 flex flex-col">
          {commentDatas?.length === 0 ? (
            <h1>該貼文尚無評論</h1>
          ) : (
            commentDatas
              ?.sort(
                (a, b) =>
                  new Date(a.commentTime).getTime() -
                  new Date(b.commentTime).getTime()
                // Sort by comment time
              )
              .map((eachcomment) => (
                <section
                  className="flex mb-4 relative w-full"
                  key={`${eachcomment.docID}`}
                >
                  <div className="avatar relative items-center flex-col mx-1 sm:mx-4 justify-center">
                    {eachcomment.avatar !== "" ? (
                      <div className="w-12 sm:w-20 rounded-full">
                        <img src={eachcomment.avatar} />
                      </div>
                    ) : (
                      <div className="w-12 sm:w-20 rounded-full relative bg-slate-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                    <span className="text-slate-400 truncate inline-block max-w-11 sm:max-w-20">
                      {eachcomment.username}
                    </span>
                  </div>
                  <div className="divider divider-horizontal"></div>
                  <div
                    className="mr-auto w-48 sm:w-80 md:w-auto break-words whitespace-normal"
                    dangerouslySetInnerHTML={{ __html: eachcomment.comment }}
                  ></div>
                  <div className="self-end hidden md:block">
                    <span className="text-gray-400 text-sm">
                      {eachcomment.commentTime.slice(0, 10)}
                    </span>
                  </div>
                  <button
                    className={`${
                      currentUser.id === eachcomment.id ? "" : "hidden"
                    } absolute top-1 right-1 opacity-30 hover:opacity-100 transition-all`}
                    onClick={() => handleDaleteComment(eachcomment.docID)}
                  >
                    <Trash2 />
                  </button>
                </section>
              ))
          )}
        </section>
        <div className="divider divider-neutral"></div>
        <section>
          <h2 className="text-xl mb-4">留下你的評論：</h2>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={quillValue}
            onChange={setQuillValue}
          ></ReactQuill>
          <div className="flex justify-end">
            <button
              className="btn btn-active btn-neutral mt-2"
              onClick={handleSaveComment}
            >
              發表
            </button>
          </div>
        </section>
      </div>
    </dialog>
  );
}
