import React from "react";

export default function DestinationInput({ handleChange, value }) {
  return (
    <label className="form-control w-full max-w-xs mb-3 ">
      <div className="label">
        <span className="label-text text-base text-[#1E2022]">旅行地點：</span>
      </div>
      <input
        type="text"
        className="py-1 px-3 outline-none text-[20px] w-full max-w-xs text-[#34373b] bg-transparent border border-[#F0F5F9] rounded-md"
        placeholder="Please enter the destination"
        name="destination"
        onChange={handleChange}
        maxLength={8}
        value={value}
      />
    </label>
  );
}

export function TitleInput({ handleChange, value }) {
  return (
    <label className="form-control w-full max-w-xs mb-3">
      <div className="label">
        <span className="label-text text-base text-[#1E2022]">標題:</span>
      </div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        maxLength={20}
        className="py-1 px-3 outline-none text-[20px] w-full max-w-xs text-[#34373b] bg-transparent transition-all border border-[#F0F5F9] rounded-md"
        onChange={handleChange}
        value={value}
      />
    </label>
  );
}
