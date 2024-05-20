import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useOnFollingSnapshot } from "../../utils/hooks/useFirestoreData";

export default function Header() {
  const { followingUsers } = useOnFollingSnapshot();
  const navigate = useNavigate();
  const location = useLocation();
  const isInSignin = location.pathname.includes("/signin");

  return (
    <div
      className={`min-h-[90px] bg-[#bfc7d1] flex text-white text-[20px] items-center px-7 ${
        isInSignin ? "hidden" : null
      }`}
    >
      <div className="flex items-center gap-4 mr-auto">
        <NavLink
          to={"/"}
          className="py-2 px-1 hover:text-[#52616B] transition-transform text-[rgba(82,97,107,.5)] text-lg xl:text-xl font-semibold"
        >
          我的頁面
        </NavLink>
        <NavLink
          to={"forum"}
          className="py-2 px-1 hover:text-[#52616B] transition-transform text-[rgba(82,97,107,.5)] text-lg xl:text-xl font-semibold"
        >
          公開貼文
        </NavLink>
        <NavLink
          to={"project"}
          className="py-2 px-1 hover:text-[#52616B] transition-transform text-[rgba(82,97,107,.5)] text-lg xl:text-xl font-semibold"
        >
          旅遊計畫
        </NavLink>
      </div>

      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-sm text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-users"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="hidden xl:inline">關注中</span>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-3 shadow rounded-box w-52 gap-2 bg-white"
        >
          {followingUsers?.length === 0 ? (
            <li className="text-[#52616B]">尚無關注用戶</li>
          ) : (
            followingUsers?.map((user) => (
              <li
                className="flex-row"
                key={user.id}
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="p-0 w-full px-3 py-2">
                  {user.avatar !== "" ? (
                    <div className="avatar p-0 mr-2">
                      <div className="w-10 rounded-full">
                        <img src={user.avatar} />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="size-10 rounded-full relative bg-slate-700 mr-4"
                      key={user.id}
                    >
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
                        className="lucide lucide-image bg-slate-700 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
                  <span className="text-[#52616B] text-base">
                    {user.username}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
