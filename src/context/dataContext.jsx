import React, { createContext, useContext, useState, useRef } from "react";
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
  const mapRef = useRef();
  const [destinationData, setDestinationData] = useState([]);
  const [dayPlan, setDayPlan] = useState([{ day1: [] }]); //裡面每個項目都是一天[[day1],[day2]]
  const [currentDay, setCurrentDay] = useState(1);

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
        mapRef,
        dayPlan,
        setDayPlan,
        currentDay,
        setCurrentDay,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
