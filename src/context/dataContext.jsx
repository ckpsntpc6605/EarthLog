import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  const [notSavedPoint, setNotSavedPoint] = useState(null);

  return (
    <DataContext.Provider
      value={{
        userCurrentClickedPost,
        setUserCurrentClickedPost,
        notSavedPoint,
        setNotSavedPoint,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
