import { Outlet } from "react-router-dom";

import Globe from "./components/Globe/Globe";
import Header from "./components/Header/Header";

import { DataProvider } from "./context/dataContext";

function App() {
  return (
    <div className="flex h-screen">
      <DataProvider>
        <Globe />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <Outlet />
        </div>
      </DataProvider>
    </div>
  );
}

export default App;
