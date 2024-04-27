import React, { useState, useMemo, useCallback } from "react";
import { usePostData } from "../../context/dataContext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import GeocoderControl from "../../utils/geocoder-control";
import DrawControl from "../../utils/draw-control";

import Pin, { DrawBoxPin } from "../Pin/pin";

export default function TravelProjectGlobe() {
  const mapContainerStyle = {
    backgroundColor: "#cbd5e0",
    width: "60%",
    height: "100vh",
    overflowY: "hidden",
    maxHeight: "100vh",
  };
  const [viewState, setViewState] = useState({
    longitude: 121,
    latitude: 23,
    zoom: 1.5,
  });

  const {
    mapRef,
    notSavedPoint,
    setNotSavedPoint,
    destinationInputValue,
    setDestinationInputValue,
    setDestinationData,
    destinationData,
    dayPlan,
    setDayPlan,
    currentDay,
    setCurrentDay,
  } = usePostData();

  const [features, setFeatures] = useState([]);
  const [currentSavedPoint, setCurerentSavePoint] = useState(null);

  const savedPointMarker = useMemo(
    () =>
      destinationData?.map((eachpoint, index) => (
        <Marker
          key={`saved_${eachpoint.id}_${index}`}
          longitude={eachpoint.coordinates[0]}
          latitude={eachpoint.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            setCurerentSavePoint(eachpoint);
            setNotSavedPoint(null);
            e.originalEvent.stopPropagation();
            mapRef.current.flyTo({
              center: [eachpoint.coordinates[0], eachpoint.coordinates[1]],
              zoom: 4,
            });
          }}
        >
          <Pin />
        </Marker>
      )),
    [destinationData]
  );
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
            mapRef.current.flyTo({
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
    [features]
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

  const addDestination = () => {
    setDayPlan((prevPlan) => {
      const updatedPlan = [...prevPlan];
      const newDataToupdatedPlan = [
        ...updatedPlan[currentDay - 1][`day${currentDay}`], //要改的那一天
        {
          id: notSavedPoint.id,
          coordinates: notSavedPoint.geometry.coordinates,
          destination: destinationInputValue.destination,
          detail: destinationInputValue.detail,
        },
      ];
      updatedPlan[currentDay - 1][`day${currentDay}`] = newDataToupdatedPlan; // 更新特定 day 的数据
      return updatedPlan;
    });
    setDestinationData((prev) => [
      ...prev,
      {
        id: notSavedPoint.id,
        coordinates: notSavedPoint.geometry.coordinates,
        destination: destinationInputValue.destination,
        detail: destinationInputValue.detail,
      },
    ]);
    setFeatures((prev) => prev.filter((each) => each.id !== notSavedPoint.id));
    setDestinationInputValue({
      destination: "",
      detail: "",
    });
    setNotSavedPoint(null);
  };

  const handleDeleteDestination = (id) => {
    setDestinationData((prevdata) => prevdata.filter((each) => each.id !== id));
    setCurerentSavePoint(null);
  };

  return (
    <Map
      id="my_map"
      ref={mapRef}
      reuseMaps
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      {...viewState}
      style={mapContainerStyle}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
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
      {savedPointMarker}
      {currentSavedPoint && (
        <Popup
          longitude={currentSavedPoint.coordinates[0]}
          latitude={currentSavedPoint.coordinates[1]}
          onClose={() => {
            setCurerentSavePoint(null);
            mapRef.current.flyTo({
              zoom: 2,
            });
          }}
        >
          <div className="relative h-auto mb-2">
            <section className="flex flex-col gap-2">
              <div className="bg-gray-500 text-white rounded-lg">
                {currentSavedPoint.coordinates[0]}
              </div>
              <div className="bg-slate-300 text-slate-800 rounded-lg">
                {currentSavedPoint.coordinates[1]}
              </div>
            </section>
          </div>
          <h2 className="text-left text-2xl">
            地點名稱：{currentSavedPoint.destination}
          </h2>
          <div className="text-left">
            <span className="font-medium">詳細資訊:</span>
            <p>{currentSavedPoint.detail}</p>
          </div>
          <div className="flex justify-end absolute right-4 bottom-2">
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
            mapRef.current.flyTo({
              zoom: 2,
            });
          }}
        >
          <div className="relative h-auto mb-2 ">
            <section className="flex flex-col gap-2">
              <div className="bg-gray-500 text-white rounded-lg">
                {notSavedPoint.geometry.coordinates[0]}
              </div>
              <div className="bg-slate-300 text-slate-800 rounded-lg">
                {notSavedPoint.geometry.coordinates[1]}
              </div>
            </section>
          </div>
          <input
            type="text"
            name="destination"
            placeholder="輸入地點名稱"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => onPopupInputChange(e)}
          />
          <textarea
            className="textarea absolute bottom-3 left-3"
            placeholder="詳細資訊"
            name="detail"
            onChange={(e) => onPopupInputChange(e)}
          ></textarea>
          <button
            className="absolute right-2 bottom-2 rounded-full text-[#cccccc] bg-[#666666] py-2 px-4"
            onClick={() => addDestination()}
          >
            加入地點
          </button>
        </Popup>
      )}
      <NavigationControl />
    </Map>
  );
}
