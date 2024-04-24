import React from "react";

export default function SelectImageButton({ handleImageChange, value }) {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label"></div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        value={value}
        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
      />
      <div className="label"></div>
    </label>
  );
}
