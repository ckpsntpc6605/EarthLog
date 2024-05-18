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
