import React, { createContext, useContext, useState, useRef } from "react";
import useGetCurrentUserPosts from "../utils/hooks/useFirestoreData";
import useAuthListener from "../utils/hooks/useAuthListener";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // const [userCurrentClickedPost, setUserCurrentClickedPost] = useState(null);
  // const [notSavedPoint, setNotSavedPoint] = useState(null);
  const currentUser = useAuthListener();
  const userPostData = useGetCurrentUserPosts();
  const mapRef = useRef();
  const [dayPlan, setDayPlan] = useState([{ day1: [] }]); //裡面每個項目都是一天[[day1],[day2]]
  // const [currentDay, setCurrentDay] = useState(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState({
    avatar: "",
    email: "",
    id: "",
    username: "",
  });
  return (
    <DataContext.Provider
      value={{
        // userCurrentClickedPost,
        // setUserCurrentClickedPost,
        // notSavedPoint,
        // setNotSavedPoint,
        userPostData,
        currentUser,
        // destinationData,
        // setDestinationData,
        mapRef,
        dayPlan,
        setDayPlan,
        // currentDay,
        // setCurrentDay,
        // isModalOpen,
        // setIsModalOpen,
        // selectedPost,
        // setSelectedPost,
        selectedUserData,
        setSelectedUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const usePostData = () => useContext(DataContext);
