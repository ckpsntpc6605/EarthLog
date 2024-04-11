import { useState } from "react";
import { Outlet } from "react-router-dom";

import Globe from "./components/Globe/Globe";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="flex">
      <Globe />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
