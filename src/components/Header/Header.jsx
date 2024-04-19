import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFollowingUsers } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";

export default function Header() {
  const [followingUsers, setFollowingUsers] = useState([]);
  const { currentUser } = usePostData();

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const users = await getFollowingUsers(currentUser.id);
        setFollowingUsers(users);
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };

    fetchFollowingUsers();
  }, [currentUser]);

  return (
    <div className="h-[101px] bg-gradient-to-r from-[#191818] to-[#626262] flex text-white text-[20px] items-center">
      <Link to={"profile"} className="px-5">
        Profile
      </Link>
      <Link to={"friend"} className="px-5">
        Friend
      </Link>
      <Link to={"post"} className="px-5">
        Post
      </Link>
      <Link to={"forum"} className="px-5">
        Forum
      </Link>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
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
            class="lucide lucide-users"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          關注中
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {followingUsers?.map((user) => (
            <li className="flex-row">
              {user.avatar !== "" ? (
                <div className="w-24 rounded-full">
                  <img src={user.avatar} />
                </div>
              ) : (
                <div className="size-[40px] rounded-full relative bg-slate-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    class="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
              <Link to={`/profile/${user.id}`} className="text-slate-600">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
