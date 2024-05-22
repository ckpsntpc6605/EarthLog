import { createContext, useState, useRef } from "react";
import useGetCurrentUserPosts from "../utils/hooks/useFirestoreData";
import useAuthListener from "../utils/hooks/useAuthListener";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const currentUser = useAuthListener();
  const userPostData = useGetCurrentUserPosts();
  const mapRef = useRef();
  return (
    <DataContext.Provider
      value={{
        userPostData,
        currentUser,
        mapRef,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
