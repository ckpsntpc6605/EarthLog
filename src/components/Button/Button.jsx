import React from "react";

export default function SelectImageButton({ handleImageChange }) {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label"></div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
      />
      <div className="label"></div>
    </label>
  );
}
