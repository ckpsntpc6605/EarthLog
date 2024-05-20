import test from "node:test";
import {
  useUserCurrentClickPost,
  useNotSavedPoint,
  useCurrentDay,
  useIsModalOpen,
  useSelectedPost,
  useControlGlobe,
} from "../src/utils/zustand";
import { renderHook, act } from "@testing-library/react";

describe("Initial state tests", () => {
  test("useUserCurrentClickPost initail state", () => {
    const { userCurrentClickedPost } = useUserCurrentClickPost.getState();
    expect(userCurrentClickedPost).toBe(null);
  });
  test("useUserCurrentClickPost initail state", () => {
    const { notSavedPoint } = useNotSavedPoint.getState();
    expect(notSavedPoint).toBe(null);
  });

  test("useCurrentDay initial state", () => {
    const { currentDay } = useCurrentDay.getState();
    expect(currentDay).toBe(1);
  });

  test("useIsModalOpen initial state", () => {
    const { isModalOpen } = useIsModalOpen.getState();
    expect(isModalOpen).toBe(false);
  });

  test("useSelectedPost initial state", () => {
    const { selectedPost } = useSelectedPost.getState();
    expect(selectedPost).toBeNull();
  });

  test("useControlGlobe initial state", () => {
    const { isScreenWidthLt1024, isUserInteracting } =
      useControlGlobe.getState();
    expect(isScreenWidthLt1024).toBe(window.innerWidth < 1024);
    expect(isUserInteracting).toBe(false);
  });
});

describe("State update function tests", () => {
  test("useCurrentDay setCurrentDay", () => {
    const { result } = renderHook(() => useCurrentDay());
    const { setCurrentDay } = result.current;
    act(() => {
      setCurrentDay(5);
    });
    const currentDay = result.current.currentDay;
    expect(currentDay).toBe(5);
  });

  test("useCurrentDay deleteDay", () => {
    const { result } = renderHook(() => useCurrentDay());
    const { deleteDay, currentDay } = result.current;
    act(() => {
      deleteDay();
    });
    const currentState = result.current;
    expect(currentState.currentDay).toBe(currentDay - 1);
  });
});
