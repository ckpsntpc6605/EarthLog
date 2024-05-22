import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { DataContext } from "../../context/dataContext";
import { updatePostIsPublic } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import useGetCurrentUserPosts from "../../utils/hooks/useFirestoreData";
import { MapPinned } from "lucide-react";
import { SinglePostCarousel } from "../../components/Carousel/Carousel";
import { useUserCurrentClickPost } from "../../utils/zustand";

export default function SinglePost() {
  const userPostData = useGetCurrentUserPosts();
  const { userCurrentClickedPost } = useUserCurrentClickPost();
  const [isPublic, setIsPublic] = useState(
    userCurrentClickedPost ? userCurrentClickedPost.isPublic : null
  );
  const [currentPost, setCurrentPost] = useState(null);
  const currentUser = useAuthListener();
  const { id } = useParams();

  useEffect(() => {
    const post = userPostData?.find((post) => post.id === id);
    setCurrentPost(post);
  }, [userPostData, id]);

  function handlePublicPost(boolean) {
    updatePostIsPublic(currentUser.id, userCurrentClickedPost.id, boolean);
    setIsPublic(boolean);
  }

  return (
    <main className="bg-[#F0F5F9] grow flex flex-col p-7 relative">
      {currentPost ? (
        <>
          <h2 className="text-[24px] text-[#1E2022] mb-6">
            {currentPost.title}
          </h2>
          <div className="bg-[#C9D6DF] p-8 shadow-[10px_-10px_0px_rgba(68,90,102,0.7)] rounded-md">
            <div className="flex items-center mb-2">
              <MapPinned size={20} color="black" />
              <span className="text-[20px] text-[#22223b] mr-auto ml-2">
                {currentPost.destination}
              </span>
              <span>{currentPost.date}</span>
            </div>
            <div className="">
              {currentPost.photos?.map((photo, index) => (
                <div key={index} className="w-full  shadow-lg shadow-gray-400">
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full rounded-md shadow-lg"
                  />
                </div>
              ))}
            </div>
            <section
              className="text-[24px] text-zinc-800 min-h-[400px] leading-9 p-3 mb-3 quillValueContainer"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            ></section>
            <div className="divider text-[#52616B]">相簿</div>
            <section>
              <SinglePostCarousel imgs={currentPost.canvasImg} />
            </section>
          </div>

          <div className="dropdown dropdown-left absolute right-2 top-4">
            <div tabIndex={0} role="button" className="btn m-1 btn-sm p-1">
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
                className="lucide lucide-ellipsis-vertical"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu shadow bg-base-100 rounded-md w-[100px]"
            >
              {isPublic !== null && (
                <li>
                  {isPublic ? (
                    <button
                      className="text-red-600 p-1 hover:ring-1 hover:ring-slate-500"
                      onClick={() => handlePublicPost(false)}
                    >
                      取消發布
                    </button>
                  ) : (
                    <button
                      className="p-1 hover:ring-1 hover:ring-slate-500"
                      onClick={() => handlePublicPost(true)}
                    >
                      發布
                    </button>
                  )}
                </li>
              )}
              <li>
                <Link
                  to={`/edit/${currentPost.id}`}
                  className="p-1 hover:ring-1 hover:ring-slate-500"
                >
                  編輯
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <p className="text-white">找不到該貼文</p>
      )}
    </main>
  );
}
