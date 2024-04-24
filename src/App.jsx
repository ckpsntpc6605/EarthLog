import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getPublicPosts } from "./utils/firebase";

import Globe from "./components/Globe/Globe";
import SelectedUserGlobe from "./components/SelectedUserGlobe/SelectedUserGlobe";
import Header from "./components/Header/Header";
import SignIn from "./pages/Sign_in/SignIn";

import { DataProvider } from "./context/dataContext";
import { MapProvider } from "react-map-gl";
import useAuthListener from "./utils/hooks/useAuthListener";

function App() {
  const currentUser = useAuthListener();

  const location = useLocation();
  const isInProfile = location.pathname.includes("/profile");
  const { id } = useParams();

  const [selectedUserPosts, setSelectedUserPost] = useState(null);
  useEffect(() => {
    if (isInProfile && id) {
      getPublicPosts()
        .then((publicPosts) => {
          const selectedUserPosts = publicPosts.filter(
            (eachpost) => eachpost.authorID === id
          );
          return setSelectedUserPost(selectedUserPosts);
        })
        .catch((error) => {
          console.error("Error fetching public posts:", error);
        });
    }
  }, [isInProfile, id]);
  console.log(selectedUserPosts);

  return (
    <div className="flex h-screen">
      <DataProvider>
        <MapProvider>
          <SignIn />
          {id && isInProfile ? (
            <SelectedUserGlobe selectedUserPosts={selectedUserPosts} />
          ) : (
            <Globe />
          )}
          {Object.keys(currentUser).length === 0 ? (
            <button
              className="btn fixed"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              登入
            </button>
          ) : (
            <>
              <div className="w-[50%] overflow-y-auto">
                <Header />
                <Outlet />
              </div>
            </>
          )}
        </MapProvider>
      </DataProvider>
    </div>
  );
}

export default App;
