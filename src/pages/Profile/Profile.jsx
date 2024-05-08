import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserData } from "../../utils/hooks/useFirestoreData";
import {
  handleSignOut,
  removePost,
  updateUserAvatar,
  getAllProjectData,
  getFollowers,
} from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import { useMap } from "react-map-gl";
import "animate.css";
import {
  Notebook,
  Plane,
  BookOpenCheck,
  EllipsisVertical,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const { map_container } = useMap();
  const [projectQuntity, setProjectQuntity] = useState(0);
  const [followers, setFollowers] = useState([]);

  const { userPostData, setUserCurrentClickedPost, currentUser } =
    usePostData();
  const userData = useUserData(currentUser.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const path = `/users/${currentUser.id}/travelProject`;
    async function fetchProjectData() {
      const docSnapshot = await getAllProjectData(path);
      setProjectQuntity(docSnapshot.length);
    }
    fetchProjectData();

    (async () => {
      const followersData = await getFollowers(currentUser.id);
      setFollowers(followersData);
    })();
  }, [currentUser]);

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
      zoom: 4,
    });
  }

  async function handleRemoveBtn(id) {
    removePost(id);
  }

  return (
    <main className="bg-[#F0F5F9] flex flex-col grow p-5 relative">
      {userData ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center ">
            <Avatar img={userData.avatar} uid={userData.id} />
            <div className="flex items-center mr-auto ml-3">
              <span className="text-[#1E2022] text-xl">
                {userData.username}
              </span>
            </div>

            <button
              className="text-slate-400 btn btn-sm flex items-center"
              onClick={onSignoutClick}
            >
              <LogOut size={16} />
              <span className="sm:hidden lg:inline">Log Out</span>
            </button>
          </div>
          <div className="divider mb-0"></div>
          <section className="flex flex-wrap py-3 text-white  gap-3 rounded-lg">
            <div className="flex flex-col text-center grow">
              <div className="flex items-center justify-center gap-2 mb-1">
                {/* <Notebook size={20} color="#9ca3af" /> */}
                <p className="sm:text-md xl:text-lg text-[#1E2022]">日記</p>
              </div>

              <p className="sm:text-2xl xl:text-3xl  text-[#788189]">
                {userPostData && `${userPostData.length}`}
              </p>
            </div>
            <div className="flex flex-col text-center grow">
              <div className="flex items-center justify-center gap-2 mb-1">
                {/* <BookOpenCheck size={20} color="#9ca3af" /> */}
                <p className="sm:text-md xl:text-lg text-[#1E2022]">公開文章</p>
              </div>
              <p className="sm:text-2xl xl:text-3xl  text-[#788189]">
                {userPostData?.filter((post) => post.isPublic).length}
              </p>
            </div>
            <div className="flex flex-col text-center grow">
              <div className="flex items-center justify-center gap-2 mb-1">
                {/* <Plane size={20} color="#9ca3af" /> */}
                <p className="sm:text-md xl:text-lg text-[#1E2022]">計畫旅行</p>
              </div>

              <p className="sm:text-2xl xl:text-3xl  text-[#788189]">
                {projectQuntity}
              </p>
            </div>
            <div className="flex flex-col text-center grow">
              <div className="flex items-center justify-center gap-2 mb-1">
                {/* <Plane size={20} color="#9ca3af" /> */}
                <p className="sm:text-md xl:text-lg text-[#1E2022]">粉絲</p>
              </div>
              <p className="sm:text-2xl xl:text-3xl  text-[#788189]">
                {followers ? followers.length : "0"}
              </p>
            </div>
          </section>
          <div className="divider mt-0"></div>
          <article className="flex flex-wrap gap-3">
            {userPostData?.map((eachpost) => (
              <div
                className="card w-full min-h-[128px] bg-base-100 shadow-xl mb-3  animate__animated animate__bounceInUp"
                key={eachpost.id}
              >
                <button
                  className="card-body p-5 relative rounded-lg grow-1 hover:scale-105 hover:shadow-[3px,3px,3px,.8,white]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${eachpost.photos[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                  }}
                  onClick={() => onNavigateClick(eachpost)}
                >
                  <div className={"card-title text-white text-left"}>
                    {eachpost.title}
                  </div>
                  <div className="flex w-full justify-between text-slate-400">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          map_container.flyTo({
                            center: [
                              eachpost.coordinates[0],
                              eachpost.coordinates[1],
                            ],
                            zoom: 6,
                          });
                        }}
                      >
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
                          className="lucide lucide-earth"
                        >
                          <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                          <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" />
                          <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </button>
                      <p className="text-slate-300">{eachpost.destination}</p>
                    </div>
                    <div className="badge bg-[#8da9c4] text-black">
                      {eachpost.isPublic ? "公開" : "私人"}
                    </div>
                  </div>

                  <div className="card-actions w-full justify-end">
                    <span className="text-gray-300 mr-auto text-sm">
                      {eachpost.date}
                    </span>
                    <div className="badge badge-outline text-slate-100">
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
                        className="lucide lucide-user"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {eachpost.author}
                    </div>
                  </div>
                </button>
                <div className="dropdown dropdown-end absolute right-0 top-4">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1 btn-sm px-1 bg-transparent border-none"
                  >
                    <EllipsisVertical color="#d1d5db" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button
                        onClick={() =>
                          document
                            .getElementById(`deletePostModal_${eachpost.id}`)
                            .showModal()
                        }
                        className="text-red-600"
                      >
                        {" "}
                        刪除文章
                      </button>
                    </li>
                  </ul>
                </div>
                <dialog id={`deletePostModal_${eachpost.id}`} className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <h3 className="font-bold text-lg mb-4 ">確認刪除？</h3>
                    <button
                      className="btn mr-4 text-red-500"
                      onClick={() => handleRemoveBtn(eachpost.id)}
                    >
                      是
                    </button>
                    <button className="btn">否</button>
                  </div>
                </dialog>
              </div>
            ))}
            <p className="text-center w-full">
              （點擊地圖右上方標記工具開始撰寫）
            </p>
          </article>
        </div>
      ) : (
        <>
          <div className="flex flex-col h-full">
            <div className="flex items-center ">
              <div className="skeleton w-[80px] h-[80px] rounded-full shrink-0"></div>
              <div className="flex items-center mr-auto ml-3">
                <div className="skeleton h-4 w-20"></div>
              </div>
            </div>
            <div className="divider divider-neutral"></div>
            <div className="flex flex-col text-center grow">
              <div className="flex items-center justify-center gap-2 mb-3">
                {/* <BookOpenCheck size={20} color="#9ca3af" /> */}
                <div className="skeleton h-4 w-full"></div>
              </div>
              <p className="sm:text-2xl xl:text-3xl  text-[#788189]">
                <div className="skeleton h-4 w-full"></div>
              </p>
            </div>
            <div className="divider divider-neutral"></div>
            <article className="flex flex-col items-center gap-3">
              <div className="skeleton h-[374px] w-full"></div>
              <div className="skeleton h-[374px] w-full"></div>
              <div className="skeleton h-[374px] w-full"></div>
            </article>
          </div>
        </>
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
    <div className="avatar relative size-[80px]">
      {img !== "" ? (
        <div className="w-24 rounded-full">
          <img src={img} />
        </div>
      ) : (
        <div className="w-20 rounded-full relative bg-slate-700">
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

      <label
        htmlFor="avatar-upload"
        className="flex items-center justify-center bg-[#C9D6DF] size-[30px] text-[#52616B] absolute bottom-0 right-0 rounded-full cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
