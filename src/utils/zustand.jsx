import { create } from "zustand";

export const useUserCurrentClickPost = create((set) => ({
  userCurrentClickedPost: null,
  setUserCurrentClickedPost: (post) => set({ userCurrentClickedPost: post }),
}));

export const useNotSavedPoint = create((set) => ({
  notSavedPoint: null,
  setNotSavedPoint: (feature) => set({ notSavedPoint: feature }),
}));
