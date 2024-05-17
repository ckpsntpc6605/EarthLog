import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPinned } from "lucide-react";
import Pin, { DrawBoxPin } from "../Pin/pin";
import { getPublicPosts, getSelectedUserProfile } from "../../utils/firebase";
import { useUserCurrentClickPost } from "../../utils/zustand";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map, { Marker, NavigationControl, Popup, useMap } from "react-map-gl";
import DrawControl from "../../utils/draw-control";
import GeocoderControl from "../../utils/geocoder-control";
import { usePostData } from "../../context/dataContext";

function Globe() {
  const { map_container } = useMap();
  const {
    currentUser,
    selectedPost,
    setIsModalOpen,
    setSelectedPost,
    setSelectedUserData,
  } = usePostData();

  const { userCurrentClickedPost, setUserCurrentClickedPost } =
    useUserCurrentClickPost();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [userInteracting, setUserInteracting] = useState(false);

  const mapContainerStyle = useMemo(() => {
    return {
      backgroundColor: "#cbd5e0",
      width: isMobile ? "100%" : "60%",
      height: "100vh",
      overflowY: "hidden",
      maxHeight: "100vh",
    };
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 2,
  });

  useEffect(() => {
    if (!map_container) return;
    console.log("正在轉");
    function spinGlobe() {
      if (userInteracting) return;
      const center = map_container.getCenter();
      center.lng -= 1;
      map_container.easeTo({ center, duration: 1000, easing: (n) => n });
    }
    spinGlobe();
    map_container.on("mousedown", () => {
      setUserInteracting(true);
    });
    map_container.on("dragstart", () => {
      setUserInteracting(true);
    });
    map_container.on("zoom", () => {
      setUserInteracting(true);
    });

    return () => {
      map_container.off("mousedown");
      map_container.off("dragstart");
      map_container.off("zoom");
    };
  });

  const {
    // setUserCurrentClickedPost,
    // userCurrentClickedPost,
    notSavedPoint,
    setNotSavedPoint,
    userPostData,
  } = usePostData();

  const navigate = useNavigate();

  const [publicPostData, setPublicPostData] = useState([]);

  const location = useLocation();
  const isInForum = location.pathname.includes("/forum");
  useEffect(() => {
    if (isInForum === true) {
      (async () => {
        const publicPosts = await getPublicPosts();
        await setPublicPostData(publicPosts);
      })();
    }
  }, [isInForum]);

  const handleNavigate = useCallback((path) => {
    navigate(`${path}`);
  }, []);

  async function getTheUserProfile(authorID) {
    try {
      const userData = await getSelectedUserProfile(authorID);
      await setSelectedUserData(userData);
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

  const [features, setFeatures] = useState([]);

  const newMarkers = useMemo(
    () =>
      features?.map((eachFeature) => (
        <Marker
          key={eachFeature.id}
          longitude={eachFeature.geometry.coordinates[0]}
          latitude={eachFeature.geometry.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setNotSavedPoint(eachFeature);
            setUserCurrentClickedPost(null);
            map_container.flyTo({
              center: [
                eachFeature.geometry.coordinates[0],
                eachFeature.geometry.coordinates[1],
              ],
              zoom: 4,
            });
          }}
        >
          <DrawBoxPin />
        </Marker>
      )),
    [features, map_container]
  );

  const publicPostMarker = useMemo(() => {
    return publicPostData?.map((eachpost) => (
      <React.Fragment key={eachpost.id}>
        <Marker
          longitude={eachpost.coordinates[0]}
          latitude={eachpost.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            getTheUserProfile(eachpost.authorID);
            handleShowPostModal(eachpost);
            setIsModalOpen(true);
            map_container.flyTo({
              center: [eachpost.coordinates[0], eachpost.coordinates[1]],
              zoom: 4,
            });
          }}
        >
          <DrawBoxPin />
        </Marker>
        {userCurrentClickedPost &&
          userCurrentClickedPost.id === eachpost.id && (
            <Popup
              longitude={eachpost.coordinates[0]}
              latitude={eachpost.coordinates[1]}
              onClose={() => setUserCurrentClickedPost(null)}
            >
              <div>
                <header className="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3 text-left">
                  <h3 className="text-20px text-bold text-white">
                    {eachpost.title}
                  </h3>
                </header>
                <div className="flex justify-between mx-3">
                  <div className="mb-2 flex gap-1 items-center">
                    <MapPinned size={16} color="#6c6c6c" />
                    <span className="text-[#6c6c6c] text-[16px]">
                      {eachpost.destination}
                    </span>
                  </div>
                  <span className="text-[#1E2022]">{eachpost.date}</span>
                </div>
                {/* <div className="mb-2 mx-3">
                  <span className="text-[#6c6c6c] text-[20px]">
                    {eachpost.country}
                  </span>
                </div> */}
                <div className="flex justify-between mb-2 mx-3">
                  <div>
                    <span className="text-[#ACACAC] text-[14px]">
                      {eachpost.author}
                    </span>
                  </div>
                  <button
                    className="rounded-xl text-[#cccccc] bg-[#666666] py-2 px-4"
                    onClick={() => {
                      handleNavigate(`/post/${eachpost.id}`);
                      map_container.flyTo({
                        center: [
                          eachpost.coordinates[0],
                          eachpost.coordinates[1],
                        ],
                      });
                    }}
                  >
                    See More
                  </button>
                </div>
              </div>
            </Popup>
          )}
      </React.Fragment>
    ));
  }, [publicPostData, userCurrentClickedPost, map_container]);

  useEffect(() => {
    if (!notSavedPoint) return;
    setFeatures((prevfeatures) => {
      const newFeatures = prevfeatures.filter(
        (eachfeat) => eachfeat.id !== notSavedPoint.id
      );
      return newFeatures;
    });
  }, [userPostData]);

  const onUpdate = useCallback((e) => {
    setFeatures((prevFeatures) => [...prevFeatures, e.features[0]]);
  }, []);
  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = currFeatures.filter(
        (eachFeature) => eachFeature.id !== e.features[0].id
      );
      return newFeatures;
    });
    setNotSavedPoint(null);
  }, []);

  const userPostedData = useMemo(
    () =>
      userPostData?.map((perdata, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={perdata.coordinates[0]}
          latitude={perdata.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setUserCurrentClickedPost(perdata);
            setNotSavedPoint(null);
            console.log("click");
            map_container.flyTo({
              center: [perdata.coordinates[0], perdata.coordinates[1]],
              zoom: 4,
            });
          }}
        >
          <Pin />
        </Marker>
      )),
    [userPostData, map_container]
  );
  return (
    <Map
      id="map_container"
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={mapContainerStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {Object.keys(currentUser).length === 0 ? (
        <></> //not login
      ) : isInForum ? (
        <>{publicPostMarker}</> //login and in forum page
      ) : (
        <>
          <GeocoderControl
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            position="top-left"
            onResult={(e) => {
              console.log("這個是result:", e.result);
              setNotSavedPoint({
                geometry: e.result.geometry,
                id: e.result.id,
                placeName: e.result.placeName,
              });
            }}
          />
          <DrawControl
            position="top-right"
            displayControlsDefault={false}
            controls={{
              point: true,
              trash: true,
            }}
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
          {userPostedData}
          {userCurrentClickedPost && (
            <Popup
              longitude={userCurrentClickedPost.coordinates[0]}
              latitude={userCurrentClickedPost.coordinates[1]}
              onClose={() => {
                setUserCurrentClickedPost(null);
                map_container.flyTo({
                  center: [
                    userCurrentClickedPost.coordinates[0],
                    userCurrentClickedPost.coordinates[1],
                  ],
                  zoom: 3,
                });
              }}
              className="globeCurrentClickedPopup"
            >
              <div className="h-full flex flex-col">
                <header className="text-white bg-[#C9D6DF] rounded-lg px-4 py-2 mb-3 text-left">
                  <h3 className="text-lg text-bold leading-6 text-[#52616B] leading-4">
                    {userCurrentClickedPost.title}
                  </h3>
                </header>
                <div className="flex justify-between mt-1">
                  <div className="mb-2 flex gap-1 items-center">
                    <MapPinned size={16} color="#6c6c6c" />
                    <span className="text-[#6c6c6c] text-[16px]">
                      {userCurrentClickedPost.destination}
                    </span>
                  </div>
                  <span className="text-[#1E2022]">
                    {userCurrentClickedPost.date}
                  </span>
                </div>
                <div class="flex justify-between mb-2 mt-7">
                  <div className="flex items-center text-[#ACACAC] gap-2">
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
                    <span class="text-[#ACACAC] text-[16px]">
                      {userCurrentClickedPost.author}
                    </span>
                  </div>
                  <button
                    class="rounded-xl text-[#52616B] text-base bg-yellow-400 hover:bg-[#34373b] hover:text-[#F0F5F9] py-2 px-4 transition-colors text-sm"
                    onClick={() =>
                      handleNavigate(`/post/${userCurrentClickedPost.id}`)
                    }
                  >
                    See More
                  </button>
                </div>
              </div>
            </Popup>
          )}
          {notSavedPoint && (
            <Popup
              longitude={notSavedPoint.geometry.coordinates[0]}
              latitude={notSavedPoint.geometry.coordinates[1]}
              onClose={() => {
                setNotSavedPoint(null);
                navigate(`/`);
                map_container.flyTo({
                  zoom: 2,
                });
              }}
            >
              <div className="relative h-full mb-6">
                <section className="flex flex-col gap-2">
                  <div className="bg-gray-500 text-white rounded-lg text-sm text-left px-3 py-2">
                    經度：{notSavedPoint.geometry.coordinates[0].toFixed(2)}
                  </div>
                  <div className="bg-slate-300 text-slate-800 rounded-lg text-sm text-left px-3 py-2">
                    緯度：{notSavedPoint.geometry.coordinates[1].toFixed(2)}
                  </div>
                </section>
              </div>
              <button
                className="self-end rounded-lg text-base text-[#555555] bg-yellow-500 py-2 px-4 tracking-wider"
                onClick={() => handleNavigate("/edit")}
              >
                開始撰寫
              </button>
            </Popup>
          )}
          {newMarkers}
        </>
      )}
      <NavigationControl />
    </Map>
  );
}

export default Globe;
