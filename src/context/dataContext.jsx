import { createContext, useState, useRef } from "react";
import useGetCurrentUserPosts from "../utils/hooks/useFirestoreData";
import useAuthListener from "../utils/hooks/useAuthListener";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const currentUser = useAuthListener();
  const userPostData = useGetCurrentUserPosts();
  const mapRef = useRef();
  const [dayPlan, setDayPlan] = useState([{ day1: [] }]); //裡面每個項目都是一天[[day1],[day2]]
  const [selectedUserData, setSelectedUserData] = useState({
    avatar: "",
    email: "",
    id: "",
    username: "",
  });
  return (
    <DataContext.Provider
      value={{
        userPostData,
        currentUser,
        mapRef,
        dayPlan,
        setDayPlan,
        selectedUserData,
        setSelectedUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
