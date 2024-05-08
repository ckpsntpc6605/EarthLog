import React from "react";

export default function DestinationInput({ handleChange, value }) {
  return (
    <label className="form-control w-full max-w-xs mb-3 ">
      <div className="label">
        <span className="label-text text-[#1E2022]">旅行地點：</span>
      </div>
      <input
        type="text"
        className="input input-bordered input-sm px-2 text-[20px] w-full max-w-xs focus:border-white focus:bg-[#003049] text-[#34373b] focus:text-white bg-transparent transition-all"
        placeholder="Please enter the destination"
        name="destination"
        onChange={handleChange}
        c
        value={value}
      />
    </label>
  );
}

export function TitleInput({ handleChange, value }) {
  return (
    <label className="form-control w-full max-w-xs mb-3">
      <div className="label">
        <span className="label-text text-[#1E2022]">標題:</span>
      </div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input input-bordered input-sm px-2 text-[20px] w-full max-w-xs focus:border focus:border-white focus:text-white focus:bg-[#003049] text-[#34373b] bg-transparent transition-all"
        onChange={handleChange}
        value={value}
      />
    </label>
  );
}
