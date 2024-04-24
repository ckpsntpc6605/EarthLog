import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map, { Marker, NavigationControl, Popup, useMap } from "react-map-gl";
import DrawControl from "../../utils/draw-control";

import { usePostData } from "../../context/dataContext";

import Pin, { DrawBoxPin } from "../Pin/pin";

import { getPublicPosts } from "../../utils/firebase";

function Globe() {
  const { map_container } = useMap();
  const { currentUser } = usePostData();
  // const secondsPerRevolution = 240;
  // const maxSpinZoom = 5;
  // const slowSpinZoom = 3;

  // let userInteracting = false;
  // const spinEnabled = true;
  // console.log(map_container);
  // function spinGlobe() {
  //   const zoom = map_container.getZoom();
  //   if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
  //     let distancePerSecond = 360 / secondsPerRevolution;
  //     if (zoom > slowSpinZoom) {
  //       const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
  //       distancePerSecond *= zoomDif;
  //     }
  //     const center = map_container.getCenter();
  //     center.lng -= distancePerSecond;
  //     map_container.easeTo({ center, duration: 1000, easing: (n) => n });
  //   }
  // }
  // useEffect(() => {
  //   if (map_container) {
  //     map_container.on("style.load", () => {
  //       spinGlobe();
  //     });
  //   }
  // }, [map_container]);

  const mapContainerStyle = {
    backgroundColor: "#cbd5e0",
    width: "65%",
    height: "100vh",
    overflowY: "hidden",
    maxHeight: "100vh",
  };
  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 1,
  });
  const {
    setUserCurrentClickedPost,
    userCurrentClickedPost,
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
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setNotSavedPoint(eachFeature);
            setUserCurrentClickedPost(null);
          }}
        >
          <DrawBoxPin />
        </Marker>
      )),
    [features]
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
            setUserCurrentClickedPost(eachpost);
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
              style={{
                transform: "translate(-50%, -100%) translate(257px, 385px)",
              }}
            >
              <div>
                <header className="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
                  <h3 className="text-20px text-bold text-white">
                    {eachpost.title}
                  </h3>
                </header>
                <div className="mb-2 mx-3">
                  <span className="text-[#6c6c6c] text-[20px]">
                    {eachpost.country}
                  </span>
                </div>
                <div className="flex justify-between mb-2 mx-3">
                  <div>
                    <span className="text-[#ACACAC] text-[14px]">
                      {eachpost.author}
                    </span>
                  </div>
                  <button
                    className="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
                    onClick={() => handleNavigate(`/post/${eachpost.id}`)}
                  >
                    See More
                  </button>
                </div>
              </div>
            </Popup>
          )}
      </React.Fragment>
    ));
  }, [publicPostData, userCurrentClickedPost]);
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
    console.log(e);
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
          }}
        >
          <Pin />
        </Marker>
      )),
    [userPostData]
  );
  return (
    <Map
      id="map_container"
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={mapContainerStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      {Object.keys(currentUser).length === 0 ? (
        <></> //not login
      ) : isInForum ? (
        <>{publicPostMarker}</> //login and in forum page
      ) : (
        <>
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
              onClose={() => setUserCurrentClickedPost(null)}
              style={{ transform: "translateY(273px) !important" }}
            >
              <div>
                <header className="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
                  <h3 className="text-[24px] text-bold text-white">
                    {userCurrentClickedPost.title}
                  </h3>
                </header>
                <div className="mb-2 mx-3 flex items-center">
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
                    class="lucide lucide-globe"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  <span className="text-[#6c6c6c] text-[16px]">
                    {userCurrentClickedPost.destination}
                  </span>
                </div>
                <div class="flex justify-between mb-2 mx-3">
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
                    class="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
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
              }}
            >
              <div className="relative h-full">
                <section className="flex flex-col gap-2">
                  <div className="bg-gray-500 text-white rounded-lg">
                    {notSavedPoint.geometry.coordinates[0]}
                  </div>
                  <div className="bg-slate-300 text-slate-800 rounded-lg">
                    {notSavedPoint.geometry.coordinates[1]}
                  </div>
                </section>
              </div>
              <button
                className="absolute right-4 bottom-4 rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
                onClick={() => handleNavigate("/edit")}
              >
                編輯
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
