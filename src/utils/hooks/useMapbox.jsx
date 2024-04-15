import { useMemo, useRef, useEffect, useCallback, useState } from "react";

import { Marker } from "react-map-gl";
import { DrawBoxPin } from "../../components/Pin/pin";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const draw = new MapboxDraw();

export default function useCreateNewMarkerAndPopup(features) {
  const [newMarker, setNewMarker] = useState([]);
  function createNewmarker() {}
  <Marker
    key={features[0].id}
    longitude={features[0].geometry.coordinates[0]}
    latitude={features[0].geometry.coordinates[1]}
    anchor="bottom"
    onClick={(e) => {
      // If we let the click event propagates to the map, it will immediately close the popup
      // with `closeOnClick: true`
      e.originalEvent.stopPropagation();
    }}
  >
    <DrawBoxPin />
  </Marker>;
}
