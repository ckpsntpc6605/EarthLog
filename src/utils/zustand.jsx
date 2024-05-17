import { create } from "zustand";

export const useUserCurrentClickPost = create((set) => ({
  userCurrentClickedPost: null,
  setUserCurrentClickedPost: (post) => set({ userCurrentClickedPost: post }),
}));
