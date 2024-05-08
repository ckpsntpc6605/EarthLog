import React, { useState, useMemo, useCallback, useEffect } from "react";

import { usePostData } from "../../context/dataContext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map, { Marker, NavigationControl, Popup, useMap } from "react-map-gl";

import Pin from "../Pin/pin";

export default function SelectedUserGlobe({ selectedUserPosts }) {
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
    zoom: 1.5,
  });

  const { selectedUserGlobe } = useMap();

  const { setUserCurrentClickedPost, userCurrentClickedPost, setSelectedPost } =
    usePostData();
  const postMarker = useMemo(
    () =>
      selectedUserPosts?.map((eachpost, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={eachpost.coordinates[0]}
          latitude={eachpost.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setUserCurrentClickedPost(eachpost);
            selectedUserGlobe.flyTo({
              center: [eachpost.coordinates[0], eachpost.coordinates[1]],
              zoom: 4,
            });
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  async function handleShowPostModal(post) {
    try {
      await setSelectedPost(post);
    } catch (e) {
      console.log(e);
    } finally {
      document.getElementById("PostDialog").showModal();
    }
  }

  return (
    <Map
      id="selectedUserGlobe"
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={mapContainerStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {postMarker}
      {userCurrentClickedPost && (
        <Popup
          longitude={userCurrentClickedPost.coordinates[0]}
          latitude={userCurrentClickedPost.coordinates[1]}
          onClose={() => {
            setUserCurrentClickedPost(null);
            selectedUserGlobe.flyTo({
              zoom: 2,
            });
          }}
        >
          <div>
            <header className="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
              <h3 className="text-24px text-bold text-white">
                {userCurrentClickedPost.title}
              </h3>
            </header>
            <div className="mb-2 mx-3">
              <span className="text-[#6c6c6c] text-[20px]">
                {userCurrentClickedPost.country}
              </span>
            </div>
            <div className="flex justify-between mb-2 mx-3">
              <div>
                <span className="text-[#ACACAC] text-[14px]">
                  {userCurrentClickedPost.author}
                </span>
              </div>
              <button
                className="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
                onClick={() => {
                  handleShowPostModal(userCurrentClickedPost);
                }}
              >
                See More
              </button>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}

//建立useMap物件建立useMap物件建立useMap物件建立useMap物件建立useMap物件建立useMap物件
