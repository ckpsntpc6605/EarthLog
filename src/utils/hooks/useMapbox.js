// import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import mapboxgl from "mapbox-gl";

// import { useEffect, useState, useRef } from "react";
// function useMapbox() {
//   const mapContainerRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [draw, setDraw] = useState(null);

//   //initialize Mapbox
//   useEffect(() => {
//     mapboxgl.accessToken =
//       "pk.eyJ1IjoidGluZ3lpY2h1YW5nIiwiYSI6ImNsdXFva2MyODAwZGQybHBiOWQxMWxqZnUifQ.vBOlt2TklSJNo7j-xTZ5yQ";

//     const initMap = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       center: [121, 23],
//       zoom: 2,
//     });

//     setMap(initMap);

//     //add some framework
//     const zoomControl = new mapboxgl.NavigationControl();
//     initMap.addControl(zoomControl, "top-right");

//     const navControl = new mapboxgl.ScaleControl({
//       maxWidth: 80,
//       unit: "metric",
//     });
//     initMap.addControl(navControl, "bottom-right");

//     const initDraw = new MapboxDraw({
//       displayControlsDefault: false,
//       controls: {
//         point: true,
//         line_string: false,
//         polygon: false,
//         trash: true,
//       },
//       showCoordinates: true,
//     });
//     initMap.addControl(initDraw);
//     setDraw(initDraw);

//     return () => {
//       if (initMap) {
//         initMap.remove();
//       }
//     };
//   }, []);

//   function handleDrawCreate(event) {
//     const { features } = event;
//     console.log(features);
//     if (features && features.length > 0) {
//       const newPoint = features[0];
//       if (newPoint.geometry && newPoint.geometry.type === "Point") {
//         const coordinates = newPoint.geometry.coordinates; // 获取点的坐标
//         console.log("New point coordinates:", coordinates);

//         // 添加一个标记到地图上
//         const el = document.createElement("div");
//         el.className = "marker";

//         const marker = new mapboxgl.Marker(el)
//           .setLngLat(coordinates)
//           .addTo(map);

//         // 添加弹出窗口（popup）
//         const popupContent = document.createElement("div");
//         popupContent.innerHTML = `
//         <h3>Popup Content</h3>
//         <p>${coordinates}</p>
//         <button onclick="deleteMarker()">删除</button>
//       `;

//         // 定义删除标记的函数
//         function deleteMarker() {
//           marker.remove();
//           map.getSource("draw-layer").setData({
//             type: "FeatureCollection",
//             features: [],
//           }); // 清空绘制的点
//           popup.remove();
//         }

//         const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
//           popupContent
//         );
//         marker.setPopup(popup);
//       }
//     }
//   }

//   return { map, draw, mapContainerRef, handleDrawCreate };
// }

// export default useMapbox;
