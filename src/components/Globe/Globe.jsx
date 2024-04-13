// import { useEffect, useRef, useState } from "react";
// import { useHistory } from "react-router-dom";
// import Map from 'react-map-gl';
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import mapboxgl from "mapbox-gl";
// import useMapbox from "../../utils/hooks/useMapbox";

// const Globe = ({ userPostData }) => {
//   const [newMarker, setNewMarker] = useState(null);
//   const [mapWidth, setMapWidth] = useState("w-[50%]");
//   const { map, draw, mapContainerRef, handleDrawCreate } = useMapbox();

//   function handleSeeMoreClick() {
//     const history = useHistory();
//     history.push("/post");
//   }

//   useEffect(() => {
//     if (map && userPostData && userPostData.length > 0) {
//       userPostData.map((perpost) => {
//         const el = document.createElement("div");
//         el.className = "marker";

//         new mapboxgl.Marker(el)
//           .setLngLat(perpost.coordinates)
//           .setPopup(
//             new mapboxgl.Popup({ offset: 25 }).setHTML(
//               `
//               <header class="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
//                 <h3 class="text-20px text-bold text-white">${perpost.title}</h3>
//               </header>
//               <div className="mb-2 mx-3">
//                 <span className="text-[#6c6c6c] text-[20px]">${perpost.country}</span>
//               </div>
//               <div class="flex justify-between mb-2 mx-3">
//                 <div>
//                   <span class="text-[#ACACAC] text-[14px]">${perpost.author}</span>
//                 </div>
//                 <button class="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4" onClick={handleSeeMoreClick}>
//                   See More
//                 </button>
//               </div>
//               `
//             )
//           )
//           .addTo(map);
//       });
//     }
//   }, [map, userPostData]);

//   function handleMapClick(e) {
//     const { lng, lat } = e.lngLat; // 从 e.lngLat 中获取经度和纬度

//     if (newMarker) {
//       newMarker.remove();
//     }

//     const marker = new mapboxgl.Marker()
//       .setLngLat([lng, lat]) // 将经度和纬度作为数组传递给 setLngLat 方法
//       .addTo(map);

//     setNewMarker(marker);
//   }

//   useEffect(() => {
//     if (map) {
//       map.on("draw.create", handleDrawCreate);
//     }
//     return () => {
//       if (map) {
//         map.off("draw.create", handleDrawCreate);
//       }
//     };
//   }, [map]);

//   return (
//     <>
//       <div
//         ref={mapContainerRef}
//         id="map"
//         className={`bg-gray-400 ${mapWidth} h-screen overflow-y-hidden max-h-screen`}
//       />
//     </>
//   );
// };

// export default Globe;
import { useEffect, useRef, useState, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import Pin from "../Pin/pin";

function Globe({ userPostData }) {
  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 2,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  const mapContainerStyle = {
    backgroundColor: "#cbd5e0", // 替换为你想要的背景颜色
    width: "50%",
    height: "100vh",
    overflowY: "hidden",
    maxHeight: "100vh",
  };

  const pins = useMemo(
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
            setPopupInfo(perdata);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
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
      {pins}
      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          onClose={() => setPopupInfo(null)}
          className="translate-y-[-10%]"
        >
          <div>
            <header class="text-white bg-gray-500 rounded-lg px-4 py-2 mb-3">
              <h3 class="text-20px text-bold text-white">${popupInfo.title}</h3>
            </header>
            <div className="mb-2 mx-3">
              <span className="text-[#6c6c6c] text-[20px]">
                ${popupInfo.country}
              </span>
            </div>
            <div class="flex justify-between mb-2 mx-3">
              <div>
                <span class="text-[#ACACAC] text-[14px]">
                  ${popupInfo.author}
                </span>
              </div>
              <button class="rounded-full text-[#cccccc] bg-[#666666] py-2 px-4">
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

export default Globe;
