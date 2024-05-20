import { renderHook, act } from "@testing-library/react";
import { useCallback, useState } from "react";

describe("onUpdate function tests", () => {
  test("onUpdate updates features correctly", () => {
    const { result } = renderHook(() => {
      const [features, setFeatures] = useState([]);
      const onUpdate = useCallback((e) => {
        setFeatures((prevFeatures) => [...prevFeatures, e.features[0]]);
      }, []);

      return { features, onUpdate };
    });

    const mockEvent = {
      features: [{ id: 1, properties: { lng: 10, lat: 20 } }],
    };

    act(() => {
      result.current.onUpdate(mockEvent);
    });

    expect(result.current.features).toHaveLength(1);
    expect(result.current.features[0]).toEqual({
      id: 1,
      properties: { lng: 10, lat: 20 },
    });
  });
});
