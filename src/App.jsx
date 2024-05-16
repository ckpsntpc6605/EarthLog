import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getPublicPosts } from "./utils/firebase";

import Globe from "./components/Globe/Globe";
import TravelProjectGlobe from "./components/TravelProjectGlobe/TravelProjectGlobe";
import SelectedUserGlobe from "./components/SelectedUserGlobe/SelectedUserGlobe";
import Header from "./components/Header/Header";
import SignIn from "./pages/Sign_in/SignIn";
import { ChevronRight } from "lucide-react";

import { DataProvider } from "./context/dataContext";
import { MapProvider } from "react-map-gl";
import useAuthListener from "./utils/hooks/useAuthListener";

function App() {
  const currentUser = useAuthListener();
  const location = useLocation();
  const isInProfile = location.pathname.includes("/profile");
  const isInTravelProject = location.pathname.includes("/project");
  const { id } = useParams();

  const [currentGlobe, setCurrentGlobe] = useState(<Globe />);
  const [isChecked, setIsChecked] = useState(
    window.innerWidth >= 1024 ? false : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsChecked(window.innerWidth >= 1024 ? false : true);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isInProfile && id) {
      setCurrentGlobe(<SelectedUserGlobe />);
    } else if (isInTravelProject) {
      setCurrentGlobe(<TravelProjectGlobe />);
    } else {
      setCurrentGlobe(<Globe />);
    }
  }, [location]);
  return (
    <div className="flex h-screen relative">
      <DataProvider>
        <MapProvider>
          {currentGlobe}
          {Object.keys(currentUser).length === 0 ? (
            <SignIn />
          ) : (
            <>
              <label
                className={`absolute flex items-center h-[50px] top-1/2 right-0 text-white z-20 cursor-pointer rounded-md hover:bg-gray-300 hover:text-black transition-all lg:hidden ${
                  isChecked ? "rotate-180" : null
                }`}
                htmlFor="mainSwitch"
              >
                <ChevronRight size={30} />
              </label>
              <input
                id="mainSwitch"
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <div
                className={`sm:absolute sm:right-0 sm:w-[420px] z-10 lg:relative lg:w-[40%] h-full bg-[rgb(23,25,26)] overflow-hidden transition-all ${
                  isChecked ? "translate-x-full" : "translate-x-0"
                }`}
              >
                <div className="w-full overflow-y-auto h-full flex flex-col">
                  <Header />
                  <Outlet />
                </div>
              </div>
            </>
          )}
        </MapProvider>
      </DataProvider>
    </div>
  );
}

export default App;
