import React, { createContext, useContext, useState } from "react";
import useFirestoreData from "../utils/hooks/useFirestoreData";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  const [notSavedPoint, setNotSavedPoint] = useState(null);
  const userPostData = useFirestoreData("/users/TestIdIdIdIdIdId/post");

  return (
    <DataContext.Provider
      value={{
        userCurrentClickedPost,
        setUserCurrentClickedPost,
        notSavedPoint,
        setNotSavedPoint,
        userPostData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
