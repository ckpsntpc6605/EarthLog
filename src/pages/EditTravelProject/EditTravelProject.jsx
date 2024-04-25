import React, { useState } from "react";
import { usePostData } from "../../context/dataContext";
import { useMap } from "react-map-gl";

export default function EditTravelProject() {
  // const { my_map } = useMap();
  // console.log(my_map);
  // const interactWithMarker = (coordinates) => {
  //   my_map.flyTo({
  //     center: [coordinates[0], coordinates[1]],
  //   });
  // };

  const { destinationData } = usePostData();

  return (
    <div>
      <form action="" className="flex flex-col gap-2">
        <label htmlFor="projectName">
          旅行名稱：
          <input
            type="text"
            placeholder="旅行名稱"
            className="input input-bordered input-sm w-full max-w-xs"
            name="projectName"
            id="projectName"
          />
        </label>
        <label htmlFor="country">
          旅遊地點：
          <input
            type="text"
            placeholder="國家或城市"
            className="input input-bordered input-sm w-full max-w-xs"
            name="country"
            id="country"
          />
        </label>
      </form>
      <section className="flex flex-wrap m-4 gap-2">
        <div className="w-[47%] bg-amber-200 rounded-2xl min-h-[300px] p-4">
          <h1 className="text-[32px] text-black">地點</h1>
          {destinationData?.map((eachdata, index) => (
            <ul className="menu bg-base-200 w-full rounded-box" key={index}>
              <li>
                <a>{eachdata.destination}</a>
              </li>
            </ul>
          ))}
        </div>
        <div className="w-[47%] bg-amber-200 rounded-2xl min-h-[300px] p-4">
          <h1 className="text-[32px] text-black">行前清單</h1>
        </div>
        <div className="w-[47%] bg-amber-200 rounded-2xl min-h-[300px] p-4">
          <h1 className="text-[32px] text-black">購物清單</h1>
        </div>
      </section>
    </div>
  );
}
