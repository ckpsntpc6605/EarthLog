import { useState } from "react";
import { Outlet } from "react-router-dom";

import Globe from "./components/Globe/Globe";
import Header from "./components/Header/Header";

import { DataProvider } from "./context/dataContext";

import useFirestoreData from "./utils/hooks/useFirestoreData";

function App() {
  const userPostData = useFirestoreData("/users/TestIdIdIdIdIdId/post");
  console.log("userPostData:", userPostData);

  const [notSavedPoint, setNotSavedPpint] = useState(null);

  const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  // console.log("userCurrentClickedPost:", userCurrentClickedPost);
  // console.log("notSavedPoint:", notSavedPoint.id);
  return (
    <div className="flex">
      <DataProvider>
        <Globe
          userPostData={userPostData}
          userCurrentClickedPost={userCurrentClickedPost}
          setUserCurrentClickedPost={setUserCurrentClickedPost}
          notSavedPoint={notSavedPoint}
          setNotSavedPpint={setNotSavedPpint}
        />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <Outlet />
        </div>
      </DataProvider>
    </div>
  );
}

export default App;
