import * as React from "react";

function Pin() {
  return (
    <img
      src="/images/placeholder.png"
      alt="pin"
      className="h-[40px] w-[40px]"
    />
  );
}

export default React.memo(Pin);
