import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetSelectedUserPost } from "../../utils/hooks/useFirestoreData";
import { useUserCurrentClickPost, useSelectedPost } from "../../utils/zustand";
import Map, { Marker, NavigationControl, Popup, useMap } from "react-map-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { MapPinned } from "lucide-react";
import Pin from "../Pin/pin";

export default function SelectedUserGlobe() {
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
    zoom: 2,
  });
  const { selectedUserGlobe } = useMap();
  const { id } = useParams();
  const userPosts = useGetSelectedUserPost(id);

  const { userCurrentClickedPost, setUserCurrentClickedPost } =
    useUserCurrentClickPost();
  const { setSelectedPost } = useSelectedPost();

  const postMarker = useMemo(
    () =>
      userPosts?.map((eachpost, index) => (
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
    [userPosts, selectedUserGlobe]
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
                onClick={() => handleShowPostModal(userCurrentClickedPost)}
              >
                See More
              </button>
            </div>
          </div>
        </Popup>
      )}
      <NavigationControl />
    </Map>
  );
}
