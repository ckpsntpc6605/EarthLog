import React, { createContext, useContext, useEffect, useState } from "react";
import useGetCurrentUserPosts from "../utils/hooks/useFirestoreData";
import useAuthListener from "../utils/hooks/useAuthListener";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  const [notSavedPoint, setNotSavedPoint] = useState(null);
  const [destinationInputValue, setDestinationInputValue] = useState({
    destination: "",
    detail: "",
  });
  const currentUser = useAuthListener();
  const userPostData = useGetCurrentUserPosts();

  const [destinationData, setDestinationData] = useState([]);
  return (
    <DataContext.Provider
      value={{
        userCurrentClickedPost,
        setUserCurrentClickedPost,
        notSavedPoint,
        setNotSavedPoint,
        userPostData,
        currentUser,
        destinationInputValue,
        setDestinationInputValue,
        destinationData,
        setDestinationData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
