import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Globe from "./components/Globe/Globe";
import TravelProjectGlobe from "./components/TravelProjectGlobe/TravelProjectGlobe";
import SelectedUserGlobe from "./components/SelectedUserGlobe/SelectedUserGlobe";
import Header from "./components/Header/Header";
import { ChevronRight } from "lucide-react";

import { MapProvider } from "react-map-gl";

function App() {
  const location = useLocation();
  const isInProfile = location.pathname.includes("/profile");
  const isInTravelProject = location.pathname.includes("/project");
  const { id } = useParams();

  const [currentGlobe, setCurrentGlobe] = useState(<Globe />);
  const [isInMobile, setIsInMobile] = useState(
    window.innerWidth >= 1024 ? false : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsInMobile(window.innerWidth >= 1024 ? false : true);
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
      <MapProvider>
        {currentGlobe}
        <>
          <button
            className={`absolute flex items-center justify-center w-[50px] bottom-0 right-1/2 translate-x-1/2 text-white z-20 cursor-pointer rounded-t-md sm:h-[50px] sm:w-fit sm:top-1/2 sm:right-0 sm:translate-x-0 sm:rounded-l-md hover:bg-gray-300 hover:text-black transition-all lg:hidden `}
            onClick={() => setIsInMobile(!isInMobile)}
          >
            <ChevronRight
              size={30}
              className={`${
                isInMobile
                  ? "rotate-90 sm:rotate-180 text-[#52616B]"
                  : "-rotate-90 sm:rotate-0 text-[#F0F5F9]"
              }`}
            />
          </button>
          <div
            className={`absolute bottom-0 right-0 w-full z-10 h-[70%] sm:h-full bg-[rgb(23,25,26)] overflow-hidden transition-all rounded-t-xl sm:rounded-t-none sm:w-[400px] lg:w-[40%] lg:relative ${
              isInMobile
                ? "sm:translate-x-full sm:translate-y-0"
                : "translate-y-full sm:translate-x-0 sm:translate-y-0"
            }`}
          >
            <div className="w-full overflow-y-auto h-full flex flex-col">
              <Header />
              <Outlet />
            </div>
          </div>
        </>
      </MapProvider>
    </div>
  );
}

export default App;
