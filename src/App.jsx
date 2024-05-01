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
  const [currentPage, setCurrentPage] = useState(<Globe />);
  const isInProfile = location.pathname.includes("/profile");
  const isInTravelProject = location.pathname.includes("/project");
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
            <div className="w-[40%] h-full bg-[rgb(23,25,26)] p-6 overflow-hidden">
              <div className="w-full overflow-y-auto h-full rounded-b-2xl flex flex-col">
                <Header />
                <Outlet />
              </div>
            </div>
          )}
        </MapProvider>
      </DataProvider>
    </div>
  );
}

export default App;
