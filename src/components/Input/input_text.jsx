import React from "react";

export default function DestinationInput({ handleChange, value }) {
  return (
    <label className="input input-bordered flex items-center gap-2 mb-2">
      旅行地點：
      <input
        type="text"
        className="grow"
        placeholder="Please enter the destination"
        name="destination"
        onChange={handleChange}
        value={value}
      />
    </label>
  );
}

export function TitleInput({ handleChange, value }) {
  return (
    <label className="form-control w-full max-w-xs mb-3">
      <div className="label">
        <span className="label-text text-white">Title:</span>
      </div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input input-bordered w-full max-w-xs input-sm"
        onChange={handleChange}
        value={value}
      />
    </label>
  );
}
