import { act, renderHook } from "@testing-library/react-hooks";

import { buildTestRouterWrapper } from "../testUtils/buildTestRouterWrapper";
import { useQueryParams } from "./useQueryParams";

describe("useQueryParams", () => {
  it("presents current query params as string map", () => {
    // Arrange
    const initialLocation = "/?key1=value1&key2=value2";

    // Act
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: buildTestRouterWrapper({ initialLocation }),
    });

    // Assert
    expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });
  });

  it("adjusts query when given params", () => {
    // Arrange
    const onLocationChange = jest.fn();
    const newParams = { key: "value" };

    // Act
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: buildTestRouterWrapper({ onLocationChange }),
    });
    act(() => {
      const setParams = result.current[1];
      setParams(newParams);
    });

    // Assert
    expect(onLocationChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "?key=value" }),
    );
  });
});
