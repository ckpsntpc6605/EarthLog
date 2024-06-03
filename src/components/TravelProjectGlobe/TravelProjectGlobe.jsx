import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map, { Marker, NavigationControl, Popup, useMap } from "react-map-gl";
import GeocoderControl from "../../utils/geocoder-control";
import DrawControl from "../../utils/draw-control";
import {
  useNotSavedPoint,
  useCurrentDay,
  useControlGlobe,
  useTravelDestinationPoint,
  useDayPlan,
} from "../../utils/zustand";

import Pin, { DrawBoxPin } from "../Pin/pin";

export default function TravelProjectGlobe() {
  const { isScreenWidthLt1024, setIsScreenWidthLt1024 } = useControlGlobe();
  const { currentSavedPoint, setCurerentSavePoint } =
    useTravelDestinationPoint();
  const { dayPlan, addDestination, setDeleteDestination } = useDayPlan();

  const travelProjectGlobeStyle = useMemo(() => {
    return {
      backgroundColor: "#cbd5e0",
      width: isScreenWidthLt1024 ? "100%" : "60%",
      height: "100vh",
      overflowY: "hidden",
      maxHeight: "100vh",
    };
  }, [isScreenWidthLt1024]);

  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 2,
  });
  const [destinationInputValue, setDestinationInputValue] = useState({
    destination: "",
    detail: "",
  });

  const { travelProjectGlobe } = useMap();
  const { currentDay } = useCurrentDay();
  const { notSavedPoint, setNotSavedPoint } = useNotSavedPoint();
  const [features, setFeatures] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setIsScreenWidthLt1024(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const savedPointMarker = useMemo(() => {
    const markers = [];
    dayPlan?.forEach((eachday) => {
      const daysArray = Object.values(eachday)[0];
      if (daysArray) {
        daysArray.forEach((perday, index) => {
          markers.push(
            <Marker
              key={`saved_${perday.id}_${index}`}
              longitude={perday.coordinates[0]}
              latitude={perday.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                setCurerentSavePoint(perday);
                setNotSavedPoint(null);
                e.originalEvent.stopPropagation();
                travelProjectGlobe.flyTo({
                  center: [perday.coordinates[0], perday.coordinates[1]],
                  zoom: 8,
                });
              }}
            >
              <Pin />
            </Marker>
          );
        });
      }
    });
    return markers;
  }, [, dayPlan, travelProjectGlobe]);
  const notSavedMarker = useMemo(
    () =>
      features?.map((eachFeature) => (
        <Marker
          key={`notsaved_${eachFeature.id}`}
          longitude={eachFeature.geometry.coordinates[0]}
          latitude={eachFeature.geometry.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setNotSavedPoint(eachFeature);
            setCurerentSavePoint(null);
            travelProjectGlobe.flyTo({
              center: [
                eachFeature.geometry.coordinates[0],
                eachFeature.geometry.coordinates[1],
              ],
              zoom: 8,
            });
          }}
        >
          <DrawBoxPin />
        </Marker>
      )),
    [features, travelProjectGlobe]
  );

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

  const onPopupInputChange = (e) => {
    const { name, value } = e.target;
    setDestinationInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleAddDestination = () => {
    addDestination(currentDay, notSavedPoint, destinationInputValue);
    setFeatures((prev) => prev.filter((each) => each.id !== notSavedPoint.id));
    setDestinationInputValue({
      destination: "",
      detail: "",
    });
    setNotSavedPoint(null);
  };

  const handleDeleteDestination = (id) => {
    console.log("Globe:", id);
    setDeleteDestination(id);
    setCurerentSavePoint(null);
  };
  console.log(dayPlan);
  return (
    <Map
      id="travelProjectGlobe"
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={travelProjectGlobeStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {id ? (
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
      ) : (
        <></>
      )}

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
      {id ? (
        <>
          {savedPointMarker}
          {currentSavedPoint && (
            <Popup
              longitude={currentSavedPoint.coordinates[0]}
              latitude={currentSavedPoint.coordinates[1]}
              onClose={() => {
                setCurerentSavePoint(null);
                travelProjectGlobe.flyTo({
                  zoom: 5,
                });
              }}
              className="travelProjectGlobePopup"
            >
              <section className="flex flex-col gap-1 border-b border-[#bfc7d1] pb-2">
                <div className="bg-[#788189] text-[#F0F5F9] rounded-lg text-center px-3 py-2 font-medium text-base">
                  {currentSavedPoint.destination}
                </div>
              </section>
              <section className="">
                <div className="text-left text-base">
                  <span className="text-[#52616B] font-medium">詳細資訊:</span>
                  <p className="text-[#52616B] indent-4 ">
                    {currentSavedPoint.detail}
                  </p>
                </div>
              </section>
              <div className="flex justify-between items-center mt-4">
                <section className="flex flex-col items-start text-[#788189]">
                  <div className="text-sm">
                    經度：{currentSavedPoint.coordinates[0].toFixed(2)}
                  </div>
                  <div className="text-sm">
                    緯度：{currentSavedPoint.coordinates[1].toFixed(2)}
                  </div>
                </section>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleDeleteDestination(currentSavedPoint.id)}
                >
                  刪除
                </button>
              </div>
            </Popup>
          )}
          {notSavedMarker}
          {notSavedPoint && (
            <Popup
              longitude={notSavedPoint.geometry.coordinates[0]}
              latitude={notSavedPoint.geometry.coordinates[1]}
              onClose={() => {
                setNotSavedPoint(null);
                travelProjectGlobe.flyTo({
                  zoom: 5,
                });
              }}
              className="travelProjectGlobePopup"
            >
              <div className="relative h-auto mb-2 ">
                <section className="flex flex-col gap-2">
                  <div className="bg-gray-500 text-white rounded-lg text-left px-3 py-1">
                    經度：{notSavedPoint.geometry.coordinates[0].toFixed(2)}
                  </div>
                  <div className="bg-slate-300 text-slate-800 rounded-lg text-left px-3 py-1">
                    緯度：{notSavedPoint.geometry.coordinates[1].toFixed(2)}
                  </div>
                </section>
              </div>
              <input
                type="text"
                name="destination"
                placeholder="輸入地點名稱"
                maxLength={8}
                className="input input-bordered input-sm w-full max-w-xs mb-2"
                onChange={(e) => onPopupInputChange(e)}
              />
              <textarea
                className="textarea mb-2"
                placeholder="詳細資訊"
                name="detail"
                maxLength={44}
                onChange={(e) => onPopupInputChange(e)}
              ></textarea>
              <button
                className="rounded-full text-[#3b3c3d] bg-[#d4eaf7] hover:bg-[#71c4ef] py-2 px-4 self-end"
                onClick={() => handleAddDestination()}
              >
                加入地點
              </button>
            </Popup>
          )}
        </>
      ) : (
        <></>
      )}

      <NavigationControl />
    </Map>
  );
}
