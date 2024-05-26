import { setDay } from "date-fns";
import { create } from "zustand";

export const useUserCurrentClickPost = create((set) => ({
  userCurrentClickedPost: null,
  setUserCurrentClickedPost: (post) => set({ userCurrentClickedPost: post }),
}));

export const useNotSavedPoint = create((set) => ({
  notSavedPoint: null,
  setNotSavedPoint: (feature) => set({ notSavedPoint: feature }),
}));

export const useCurrentDay = create((set) => ({
  currentDay: 1,
  setCurrentDay: (day) => set({ currentDay: day }),
  deleteDay: () =>
    set((state) => ({
      currentDay: state.currentDay > 1 ? state.currentDay - 1 : 1,
    })),
}));

export const useIsModalOpen = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (boolean) => set({ isModalOpen: boolean }),
}));

export const useSelectedPost = create((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));

export const useControlGlobe = create((set) => ({
  isScreenWidthLt1024: window.innerWidth < 1024,
  isUserInteracting: false,
  setIsScreenWidthLt1024: (value) => set({ isScreenWidthLt1024: value }),
  setIsUserInteracting: (boolean) => set({ isUserInteracting: boolean }),
}));

export const useTravelDestinationPoint = create((set) => ({
  currentSavedPoint: null,
  setCurerentSavePoint: (destinations) =>
    set({ currentSavedPoint: destinations }),
}));

export const useSelectedUserData = create((set) => ({
  selectedUserData: {
    avatar: "",
    email: "",
    id: "",
    username: "",
  },
  setSelectedUserData: (data) => set({ selectedUserData: data }),
}));

export const useDayPlan = create((set) => ({
  dayPlan: [{ day1: [] }],
  setDayPlan: (plandata) => set({ dayPlan: plandata }),
  addDestination: (currentDay, notSavedPoint, destinationInputValue) => {
    set((prevPlan) => {
      const updatedPlan = [...prevPlan.dayPlan];
      const newDataToupdatedPlan = [
        ...updatedPlan[currentDay - 1][`day${currentDay}`],
        {
          id: notSavedPoint.id,
          coordinates: notSavedPoint.geometry.coordinates,
          destination: destinationInputValue.destination,
          detail: destinationInputValue.detail,
        },
      ];
      updatedPlan[currentDay - 1][`day${currentDay}`] = newDataToupdatedPlan;
      return { dayPlan: updatedPlan };
    });
  },
  setDeleteDestination: (id) =>
    set((prev) => ({
      days: prev.dayPlan.map((dayObj) => {
        const dayKey = Object.keys(dayObj)[0];
        const dayArray = dayObj[dayKey];
        const filteredDayArray = dayArray.filter((item) => item.id !== id);
        return { [dayKey]: filteredDayArray };
      }),
    })),

  addNewDay: (newDay) =>
    set((prevState) => ({
      dayPlan: [...prevState.dayPlan, { [newDay]: [] }],
    })),

  removeDay: (day) =>
    set((prevState) => ({
      dayPlan: prevState.dayPlan
        .filter((dayObj) => Object.keys(dayObj)[0] !== day)
        .reduce((acc, dayObj, index) => {
          const newKey = `day${index + 1}`;
          return [...acc, { [newKey]: dayObj[Object.keys(dayObj)[0]] }];
        }, []),
    })),
}));
