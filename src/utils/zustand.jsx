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
  deleteDay: () => set((state) => ({ currentDay: state.currentDay - 1 })),
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
