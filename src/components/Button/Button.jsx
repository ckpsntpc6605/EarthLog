import React from "react";

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
      className="cursor-pointer absolute buttom-1 right-2 z-50 text-white"
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
