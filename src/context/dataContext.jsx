import React, { createContext, useContext, useState } from "react";
import useFirestoreData from "../utils/hooks/useFirestoreData";
import useAuthListener from "../utils/hooks/useAuthListener";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  const [notSavedPoint, setNotSavedPoint] = useState(null);
  const currentUser = useAuthListener();
  const userPostData = useFirestoreData(currentUser.id);

  return (
    <DataContext.Provider
      value={{
        userCurrentClickedPost,
        setUserCurrentClickedPost,
        notSavedPoint,
        setNotSavedPoint,
        userPostData,
        currentUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
