import React from "react";
import { Route, useParams } from "react-router-dom";
import { ScreenRouteSpecification } from "./ScreenRouteSpecification";
import { useQueryParams } from "./useQueryParams";

export interface ScreenRouteOutletProps<T> {
  notFoundContent: React.ReactNode;
  specification: ScreenRouteSpecification<T>;
}

export function ScreenRouteOutlet<T>({
  notFoundContent,
  specification,
}: ScreenRouteOutletProps<T>) {
  return (
    <Route
      path={specification.pathMatch}
      exact={!specification.allowInexactMatch}
    >
      <ScreenRouteOutletContent
        notFoundContent={notFoundContent}
        specification={specification}
      />
    </Route>
  );
}

function ScreenRouteOutletContent<T>({
  notFoundContent,
  specification,
}: ScreenRouteOutletProps<T>) {
  const pathParams = useParams<Record<string, string | undefined>>();
  const [queryParams] = useQueryParams<Record<string, string | undefined>>();
  if (typeof specification.content !== "function") {
    return specification.content;
  }
  if (!specification.getParams) {
    return notFoundContent;
  }
  let mergedParams: T;
  try {
    mergedParams = specification.getParams(pathParams, queryParams);
  } catch {
    return notFoundContent;
  }
  return specification.content(mergedParams);
}
