import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
          <>
            <label
              className={`absolute flex items-center h-[50px] top-1/2 right-0 text-white z-20 cursor-pointer rounded-l-md hover:bg-gray-300 hover:text-black transition-all lg:hidden `}
              htmlFor="rightSideSwitch"
            >
              <ChevronRight
                size={30}
                color={`${isChecked ? "#F0F5F9" : "#52616B"}`}
                className={`${isChecked ? "rotate-180" : null}`}
              />
            </label>
            <input
              id="rightSideSwitch"
              type="checkbox"
              className="hidden"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <div
              className={`absolute right-0 w-[400px] z-10 lg:relative lg:w-[40%] h-full bg-[rgb(23,25,26)] overflow-hidden transition-all ${
                isChecked ? "translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="w-full overflow-y-auto h-full flex flex-col">
                <Header />
                <Outlet />
              </div>
            </div>
          </>
        </MapProvider>
      </DataProvider>
    </div>
  );
}

export default App;
