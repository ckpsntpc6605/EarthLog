import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
import { DataContext } from "../../context/dataContext";
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
import { useSelectedPost } from "../../utils/zustand";
import { useGetFireStoreDocs } from "../../utils/hooks/useFirestoreData";

const initialState = {
  isPuclicOrCollected: "publicPosts",
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "RESET_IS_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    case "SET_IS_IN_PUBLICPOST_OR_COLLECT":
      return {
        ...state,
        isPuclicOrCollected: action.payload,
      };

    default:
      return state;
  }
}

const SET_IS_LOADING = "SET_IS_LOADING";
const RESET_IS_LOADING = "RESET_IS_LOADING";
const SET_IS_IN_PUBLICPOST_OR_COLLECT = "SET_IS_IN_PUBLICPOST_OR_COLLECT";

export default function Forum() {
  const { map_container } = useMap();
  const [publicPosts, setPublicPosts] = useState([]);
  const [collectedPosts, setCollectedPosts] = useState([]);
  const { selectedPost, setSelectedPost } = useSelectedPost();

  const { currentUser, selectedUserData, setSelectedUserData } =
    useContext(DataContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const collectedPostsPath = `users/${currentUser.id}/collectedPosts`;
  const { data } = useGetFireStoreDocs(collectedPostsPath);

  useEffect(() => {
    const collectedpost = publicPosts.filter((perpost) =>
      data.some((item) => item.docID === perpost.id)
    );
    setCollectedPosts(collectedpost);
  }, [data, publicPosts]);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        dispatch({ type: SET_IS_LOADING });
        const posts = await getPublicPosts();
        setPublicPosts(posts);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        dispatch({ type: RESET_IS_LOADING });
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
    const getPostsPath = `users/${currentUser.id}/collectedPosts`;
    try {
      const result = await collectPost(path); //only collect postID
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCancelCollectPost(postID) {
    const path = `users/${currentUser.id}/collectedPosts/${postID}`;
    try {
      await cancelCollect(path);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSwitchTab(tag) {
    dispatch({ type: SET_IS_IN_PUBLICPOST_OR_COLLECT, payload: tag });
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
              state.isPuclicOrCollected === "publicPosts" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-[#788189]`}
            onClick={() => handleSwitchTab("publicPosts")}
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
              state.isPuclicOrCollected === "collectedPost" ? "tab-active" : ""
            } [--tab-bg:#fcbf49] [--tab-border-color:orange] text-[#788189]`}
            onClick={() => handleSwitchTab("collectedPost")}
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
      {state.isPuclicOrCollected === "publicPosts" && (
        <div
          className="flex flex-col h-[380px] mb-5 items-center justify-center 2xl:justify-around" //must give height or the swipper's pagination will overflow
        >
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-[#52616B]">熱門文章</h1>
            {state.isLoading && (
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
      {state.isPuclicOrCollected === "publicPosts" ? (
        <h1 className="text-xl text-center text-[#52616B]">所有文章</h1>
      ) : (
        <h1 className="text-xl text-center text-[#52616B]">收藏文章</h1>
      )}

      <section className="flex flex-col justify-center mt-5 ml-auto mr-auto flex-wrap xl:flex-row xl:gap-x-5">
        {state.isLoading && (
          <>
            <div className="skeleton h-[230px] w-full mb-3"></div>
            <div className="skeleton h-[230px] w-full mb-3"></div>
            <div className="skeleton h-[230px] w-full mb-3"></div>
          </> //Loading skeleton
        )}
        <Posts
          posts={
            state.isPuclicOrCollected === "publicPosts"
              ? publicPosts
              : collectedPosts
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
    </main>
  );
}
