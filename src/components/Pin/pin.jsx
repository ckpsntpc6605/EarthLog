import * as React from "react";

function Pin() {
  return (
    <img
      src="/images/placeholder.png"
      alt="pin"
      className="h-[40px] w-[40px] cursor-pointer"
    />
  );
}

export default React.memo(Pin);

function drawBoxPin() {
  return (
    <img
      src="/images/location-pin.png"
      alt="pin"
      className="h-[50px] w-[50px] cursor-pointer"
    />
  );
}
export const DrawBoxPin = React.memo(drawBoxPin);
