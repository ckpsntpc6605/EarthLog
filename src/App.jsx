import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getPublicPosts } from "./utils/firebase";

import Globe from "./components/Globe/Globe";
import TravelProjectGlobe from "./components/TravelProjectGlobe/TravelProjectGlobe";
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
  const isInTravelProject = location.pathname.includes("/project");
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(<Globe />);
  const [selectedUserPosts, setSelectedUserPost] = useState(null);

  useEffect(() => {
    if (isInProfile) {
      setCurrentPage(
        <SelectedUserGlobe selectedUserPosts={selectedUserPosts} />
      );
    } else if (isInTravelProject) {
      setCurrentPage(<TravelProjectGlobe />);
    } else {
      setCurrentPage(<Globe />);
    }
  }, [location]);

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

  // if (isInProfile) {
  //   return <SelectedUserGlobe selectedUserPosts={selectedUserPosts} />;
  // } else if (isInTravelProject) {
  //   return <TravelProjectGlobe />;
  // }

  return (
    <div className="flex h-screen relative">
      <DataProvider>
        <MapProvider>
          {currentPage}
          {Object.keys(currentUser).length === 0 ? (
            <SignIn />
          ) : (
            <>
              <label
                className="absolute top-20 left-0 text-white z-20 md:hidden"
                htmlFor="mainSwitch"
              >
                啟動
              </label>
              <input id="mainSwitch" type="checkbox" className="hidden" />
              <div className="sm:absolute sm:right-0 sm:w-[420px] z-10 lg:w-[40%] h-full bg-[rgb(23,25,26)] p-6 overflow-hidden">
                <div className="w-full overflow-y-auto h-full rounded-b-2xl flex flex-col">
                  <Header />
                  <Outlet />
                </div>
              </div>
            </>
          )}
          <button></button>
        </MapProvider>
      </DataProvider>
    </div>
  );
}

export default App;
