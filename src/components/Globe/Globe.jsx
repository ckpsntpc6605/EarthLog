import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-77.032, 38.913],
      },
      properties: {
        title: "Mapbox",
        description: "Washington, D.C.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-122.414, 37.776],
      },
      properties: {
        title: "Mapbox",
        description: "San Francisco, California",
      },
    },
  ],
};

const Globe = () => {
  const mapContainerRef = useRef(null);
  const [mapWidth, setMapWidth] = useState("w-[50%]");
  //   useEffect(() => {
  //     mapboxgl.accessToken =
  //       "pk.eyJ1IjoidGluZ3lpY2h1YW5nIiwiYSI6ImNsdXFva2MyODAwZGQybHBiOWQxMWxqZnUifQ.vBOlt2TklSJNo7j-xTZ5yQ";

  //     const map = new mapboxgl.Map({
  //       container: mapContainerRef.current,
  //       center: [121, 23],
  //       zoom: 2,
  //     });

  //     for (const feature of geojson.features) {
  //       const el = document.createElement("div");
  //       el.className = "marker";

  //       new mapboxgl.Marker(el)
  //         .setLngLat(feature.geometry.coordinates)
  //         .setPopup(
  //           new mapboxgl.Popup({ offset: 25 }) // add popups
  //             .setHTML(
  //               `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
  //             )
  //         )
  //         .addTo(map);
  //     }
  //     return () => map.remove();
  //   }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      className={`bg-gray-400 ${mapWidth} h-screen overflow-y-hidden`}
    />
  );
};

export default Globe;
