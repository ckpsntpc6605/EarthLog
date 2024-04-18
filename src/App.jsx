import { Outlet } from "react-router-dom";

import Globe from "./components/Globe/Globe";
import Header from "./components/Header/Header";
import SignIn from "./pages/Sign_in/SignIn";

import { DataProvider } from "./context/dataContext";
import { useState } from "react";
import useAuthListener from "./utils/hooks/useAuthListener";

function App() {
  const currentUser = useAuthListener();
  return (
    <div className="flex h-screen">
      <DataProvider>
        <Globe />

        <SignIn />

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
      </DataProvider>
    </div>
  );
}

export default App;
