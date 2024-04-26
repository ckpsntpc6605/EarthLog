import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserData } from "../../utils/hooks/useFirestoreData";
import {
  handleSignOut,
  removePost,
  updateUserAvatar,
} from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import { useMap } from "react-map-gl";

export default function Profile() {
  const { map_container } = useMap();

  const { userPostData, setUserCurrentClickedPost, currentUser } =
    usePostData();
  const userData = useUserData(currentUser.id);
  const navigate = useNavigate();
  async function onSignoutClick() {
    if (currentUser) {
      try {
        await handleSignOut();
        navigate("/");
      } catch (e) {
        console.log(e);
      }
    }
  }

  function onNavigateClick(postdata) {
    setUserCurrentClickedPost(postdata);
    navigate(`/post/${postdata.id}`);
    map_container.flyTo({
      center: [postdata.coordinates[0], postdata.coordinates[1]],
    });
  }

  async function handleRemoveBtn(id) {
    removePost(id);
  }

  return (
    <main className="bg-[#2b2d42] min-h-full h-auto flex flex-col p-5 relative">
      {userData ? (
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <Avatar img={userData.avatar} uid={userData.id} />
            <div className="flex items-center mr-auto">
              <span className="text-slate-400">{userData.username}</span>
              <button className="text-slate-400">
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
                  className="lucide lucide-square-pen"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                </svg>
              </button>
            </div>

            <button
              className="text-slate-400 btn btn-sm"
              onClick={onSignoutClick}
            >
              Log Out
            </button>
          </div>
          <article className="flex flex-wrap">
            {userPostData?.map((eachpost) => (
              <div
                className="card w-80 bg-base-100 shadow-xl mb-3"
                key={eachpost.id}
              >
                <figure className="relative">
                  {eachpost.photos.length === 0 ? (
                    <div className="h-[100px] bg-gray-300 w-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        class="lucide lucide-image"
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
                  ) : (
                    <img
                      className="max-w-full max-h-[100px]"
                      src={eachpost.photos[0]}
                      alt="post_photo"
                    />
                  )}
                  <button className="text-slate-400 absolute bottom-2 right-2">
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
                      className="lucide lucide-square-pen"
                    >
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                    </svg>
                  </button>
                </figure>
                <div className="card-body">
                  <button
                    onClick={() => onNavigateClick(eachpost)}
                    className={"card-title"}
                  >
                    {eachpost.title}
                    <div className="badge bg-[#8da9c4] text-black">
                      {eachpost.isPublic ? "公開" : "私人"}
                    </div>
                  </button>
                  <div className="flex">
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
                      class="lucide lucide-earth"
                    >
                      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                      <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" />
                      <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <p>{eachpost.destination}</p>
                  </div>

                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">
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
                        class="lucide lucide-user"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {eachpost.author}
                    </div>
                  </div>
                </div>
                <div className="dropdown dropdown-end absolute right-1">
                  <div tabIndex={0} role="button" className="btn m-1">
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
                      class="lucide lucide-ellipsis-vertical"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button
                        onClick={() =>
                          document
                            .getElementById("deletePostBtnModal")
                            .showModal()
                        }
                        className="text-red-600 "
                      >
                        {" "}
                        刪除文章
                      </button>
                    </li>
                  </ul>
                </div>
                <dialog id="deletePostBtnModal" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <h3 className="font-bold text-lg">確認刪除？</h3>
                    <button
                      className="btn"
                      onClick={() => handleRemoveBtn(eachpost.id)}
                    >
                      是
                    </button>
                    <button className="btn">否</button>
                  </div>
                </dialog>
              </div>
            ))}
          </article>
        </div>
      ) : (
        <p>尚未登入</p>
      )}
    </main>
  );
}

function Avatar({ uid, img }) {
  function handleFileChange(e, uid) {
    const file = e.target.files[0];
    updateUserAvatar(uid, file);
  }
  return (
    <div className="avatar relative">
      {img !== "" ? (
        <div className="w-24 rounded-full">
          <img src={img} />
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
            class="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      )}

      <label
        htmlFor="avatar-upload"
        className="text-slate-300 absolute bottom-0 right-0 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-square-pen"
        >
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, uid)}
      />
    </div>
  );
}
