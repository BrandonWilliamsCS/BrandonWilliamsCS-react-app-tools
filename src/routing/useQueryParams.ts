import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  parse as parseQueryString,
  stringify as stringifyQuery,
} from "query-string";

export function useQueryParams<T extends QueryParams<T>>(): [
  T,
  (newParams: T) => void,
] {
  // Read URL query params into search query
  const { search: currentSearch } = useLocation();
  const currentParams = React.useMemo<T>(
    () => parseQueryString(currentSearch),
    [currentSearch],
  );

  // Write search queries into URL params
  const history = useHistory();
  const setParams = React.useCallback(
    (newValue: T) => {
      const newParams = { ...currentParams };
      Object.keys(newValue).forEach((key) => {
        // Shouldn't need to cast this, but Object.keys produces a general string type.
        newParams[key as keyof T] = newValue[key as keyof T];
      });
      const newSearch = stringifyQuery(newParams);
      history.push({ search: `?${newSearch}` });
    },
    // TODO: make setParams stable across renders by getting currentParams through a ref.
    [history, currentParams],
  );

  return [currentParams, setParams];
}

// This enforces that any key in T must map to a string (or undefined).
type QueryParams<T> = { [K in keyof T]?: string };
