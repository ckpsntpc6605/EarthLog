import React from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { CircleHelp } from "lucide-react";

// export default function SelectImageButton({ handleImageChange }) {
//   return (
//     <label className="form-control w-full max-w-xs mt-[70px]">
//       <div className="label"></div>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="file-input file-input-bordered w-full max-w-xs"
//       />
//       <div className="label"></div>
//     </label>
//   );
// }
export default function SelectImageButton({ handleImageChange, value }) {
  return (
    <label
      htmlFor="fileInput"
      className="cursor-pointer absolute top-1 right-1 z-50 text-gray text-gray-500"
    >
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
        className="lucide lucide-square-pen"
      >
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        value={value}
        className="hidden"
      />
    </label>
  );
}

export function TutorialButton() {
  const driverObj = driver({
    showProgress: true,
    popoverClass: "begginer_tutorial",
    nextBtnText: "—›",
    prevBtnText: "‹—",
    steps: [
      {
        element: ".mapbox-gl-draw_point",
        popover: {
          title: "地圖標記工具",
          description: "點選標記工具後，可在地圖上進行標記",
        },
      },
      {
        element: "#map_container",
        popover: {
          title: "標記旅行的地點",
          description: "在地圖上找到您旅遊的地點並標記",
          align: "center",
        },
      },
      {
        popover: {
          title: "Title",
          description:
            "<img src='/images/tutorial_img.png' alt='tutorial_img' /><span style='font-size: 15px; display: block; margin-top: 10px; text-align: left;'>點選標記並確認後即可開始編輯！</span>",
        },
      },
    ],
  });

  const handleStartTutorial = () => {
    driverObj.drive(); // 开始教程
  };

  return (
    <button onClick={handleStartTutorial}>
      <CircleHelp />
    </button>
  );
}
