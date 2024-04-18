import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import DrawControl from "../../utils/draw-control";

import { usePostData } from "../../context/dataContext";

import Pin, { DrawBoxPin } from "../Pin/pin";

import { getPublicPosts } from "../../utils/firebase";

function Globe() {
  const mapContainerStyle = {
    backgroundColor: "#cbd5e0",
    width: "50%",
    height: "100vh",
    overflowY: "hidden",
    maxHeight: "100vh",
  };
  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 2,
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
          }}
        >
          <Pin />
        </Marker>
      )),
    [userPostData]
  );
  return (
    <Map
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={mapContainerStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      {isInForum ? (
        <>{publicPostMarker}</>
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
            >
              <div>
                <header className="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
                  <h3 className="text-20px text-bold text-white">
                    {userCurrentClickedPost.title}
                  </h3>
                </header>
                <div className="mb-2 mx-3">
                  <span className="text-[#6c6c6c] text-[20px]">
                    {userCurrentClickedPost.country}
                  </span>
                </div>
                <div class="flex justify-between mb-2 mx-3">
                  <div>
                    <span class="text-[#ACACAC] text-[14px]">
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
              <div>
                <section className="flex flex-col ">
                  <div className="bg-gray-500 text-white">
                    {notSavedPoint.geometry.coordinates[0]}
                  </div>
                  <div className="bg-slate-540 text-slate-800">
                    {notSavedPoint.geometry.coordinates[1]}
                  </div>
                </section>
                <button
                  className="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
                  onClick={() => handleNavigate("/edit")}
                >
                  編輯
                </button>
              </div>
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
