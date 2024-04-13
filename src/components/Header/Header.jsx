import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="h-[101px] w-full bg-gradient-to-r from-[#191818] to-[#626262] flex text-white text-[20px] items-center">
      <Link to={"profile"} className="px-5">
        Profile
      </Link>
      <Link to={"friend"} className="px-5">
        Friend
      </Link>
      <Link to={"post"} className="px-5">
        Post
      </Link>
    </div>
  );
}
