import React, { useEffect, useCallback } from "react";
import {
  getPublicPosts,
  getSelectedUserProfile,
  collectPost,
  cancelCollect,
} from "../../utils/firebase";
import "react-quill/dist/quill.snow.css";
import { useMap } from "react-map-gl";
import Posts from "../../components/Posts/Posts";
import PostDialog from "../../components/PostDialog/PostDialog";
import PopularArticles from "../../components/PopularArticles/PopularArticles";
import Toast from "../../components/Toast/Toast";
import { useSelectedPost, useSelectedUserData } from "../../utils/zustand";
import { create } from "zustand";
import { useGetFireStoreDocs } from "../../utils/hooks/useFirestoreData";
import useAuthListener from "../../utils/hooks/useAuthListener";

const useStateStore = create((set) => ({
  isPuclicOrCollected: "publicPosts",
  isLoading: false,
  publicPosts: [],
  collectedPosts: [],
  collectPostResultAndMsg: {
    result: null,
    msg: "",
  },
  setIsLoading: (boolean) => set({ isLoading: boolean }),
  setIsPublicOrCollected: (tag) => set({ isPuclicOrCollected: tag }),
  setPublicPosts: (posts) => set({ publicPosts: posts }),
  setCollectedPosts: (posts) => set({ collectedPosts: posts }),
  setCollectPostResultAndMsg: (result, msg) => {
    set({ collectPostResultAndMsg: { result, msg } });
    setTimeout(() => {
      set({ collectPostResultAndMsg: { result: null, msg: "" } });
    }, 3000);
  },
}));

export default function Forum() {
  const { map_container } = useMap();
  const currentUser = useAuthListener();
  const { selectedPost, setSelectedPost } = useSelectedPost();
  const { selectedUserData, setSelectedUserData } = useSelectedUserData();

  const {
    isLoading,
    setIsLoading,
    isPuclicOrCollected,
    setIsPublicOrCollected,
    publicPosts,
    setPublicPosts,
    collectedPosts,
    setCollectedPosts,
    collectPostResultAndMsg,
    setCollectPostResultAndMsg,
  } = useStateStore();

  const collectedPostsPath = `users/${currentUser.id}/collectedPosts`;
  const { data: collectedPostsData } = useGetFireStoreDocs(collectedPostsPath);

  useEffect(() => {
    const collectedpost = publicPosts?.filter((perpost) =>
      collectedPostsData?.some((item) => item.docID === perpost.id)
    );
    setCollectedPosts(collectedpost);
  }, [collectedPostsData, publicPosts]);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getPublicPosts();
        setPublicPosts(posts);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  async function getTheUserProfile(authorID) {
    try {
      const userData = await getSelectedUserProfile(authorID);
      await setSelectedUserData(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCollectPost(postID) {
    const path = `users/${currentUser.id}/collectedPosts/${postID}`;
    try {
      const result = await collectPost(path); //only collect postID
      if (result) {
        setCollectPostResultAndMsg(result, "收藏成功！");
      } else {
        setCollectPostResultAndMsg(result, "收藏失敗...");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCancelCollectPost(postID) {
    const path = `users/${currentUser.id}/collectedPosts/${postID}`;
    try {
      const result = await cancelCollect(path);
      if (result) {
        setCollectPostResultAndMsg(result, "已取消收藏！");
      } else {
        setCollectPostResultAndMsg(result, "取消收藏失敗");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleShowPostModal = useCallback(
    (post) => {
      try {
        setSelectedPost(post);
      } catch (e) {
        console.log(e);
      }
    },
    [setSelectedPost]
  );

  useEffect(() => {
    if (selectedPost) {
      document.getElementById("PostDialog").showModal();
    }
  }, [selectedPost]);

  return (
    <main className="bg-[#F0F5F9] flex flex-1 flex-col p-7 relative">
      <header className="mb-4 flex justify-center">
        <div role="tablist" className="tabs tabs-lifted w-96 lg:w-full">
          <a
            id="publicPosts"
            role="tab"
            className={`tab ${
              isPuclicOrCollected === "publicPosts" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-[#788189]`}
            onClick={() => setIsPublicOrCollected("publicPosts")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-earth mr-1"
            >
              <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
              <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" />
              <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            公開貼文
          </a>
          <a
            id="myCollection"
            role="tab"
            className={`tab ${
              isPuclicOrCollected === "collectedPost" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-[#788189]`}
            onClick={() => setIsPublicOrCollected("collectedPost")}
          >
            <img
              src="/images/save-instagram.png"
              alt=""
              className="size-[16px] mr-1"
            />
            我的收藏
          </a>
        </div>
      </header>

      {/* PopularArticles */}
      {isPuclicOrCollected === "publicPosts" && (
        <div
          className="flex flex-col h-[380px] mb-5 items-center justify-center 2xl:justify-around" //must give height or the swipper's pagination will overflow
        >
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-[#52616B]">熱門文章</h1>
            {isLoading && (
              <>
                <div className="skeleton h-[216px] w-96 mb-3 mt-5"></div>
              </> //Loading skeleton
            )}
          </div>

          <PopularArticles
            publicPosts={publicPosts}
            getTheUserProfile={getTheUserProfile}
            map_container={map_container}
            collectedPosts={collectedPosts}
            handleCancelCollectPost={handleCancelCollectPost}
            handleCollectPost={handleCollectPost}
            handleShowPostModal={handleShowPostModal}
          />
          <div className="divider divider-neutral"></div>
        </div>
      )}

      {/* All public posts */}
      {isPuclicOrCollected === "publicPosts" ? (
        <h1 className="text-xl text-center text-[#52616B]">所有文章</h1>
      ) : (
        <h1 className="text-xl text-center text-[#52616B]">收藏文章</h1>
      )}

      <section className="flex flex-col justify-center mt-5 ml-auto mr-auto flex-wrap xl:flex-row xl:gap-x-5">
        {isLoading && (
          <>
            <div className="skeleton h-[230px] w-full mb-3"></div>
            <div className="skeleton h-[230px] w-full mb-3"></div>
            <div className="skeleton h-[230px] w-full mb-3"></div>
          </> //Loading skeleton
        )}
        <Posts
          posts={
            isPuclicOrCollected === "publicPosts" ? publicPosts : collectedPosts
          }
          getTheUserProfile={getTheUserProfile}
          map_container={map_container}
          collectedPosts={collectedPosts}
          handleCancelCollectPost={handleCancelCollectPost}
          handleCollectPost={handleCollectPost}
          handleShowPostModal={handleShowPostModal}
        />
      </section>

      {selectedPost && (
        <PostDialog
          post={selectedPost}
          setSelectedPost={setSelectedPost}
          currentUser={currentUser}
          selectedUserData={selectedUserData}
          setSelectedUserData={setSelectedUserData}
        />
      )}
      {collectPostResultAndMsg.result !== null && (
        <Toast
          msg={collectPostResultAndMsg.msg}
          result={collectPostResultAndMsg.result}
        />
      )}
    </main>
  );
}
