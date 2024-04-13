import { useState } from "react";
import { Outlet } from "react-router-dom";

import Globe from "./components/Globe/Globe";
import Header from "./components/Header/Header";

import useFirestoreData from "./utils/hooks/useFirestoreData";

function App() {
  const userPostData = useFirestoreData("/users/TestIdIdIdIdIdId/post");
  console.log(userPostData);
  return (
    <div className="flex">
      <Globe userPostData={userPostData} />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
