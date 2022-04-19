import React from "react";

export interface ScreenRouteSpecification<T = void> {
  content: React.ReactNode | ((params: T) => React.ReactNode);
  pathMatch: string;
  allowInexactMatch?: boolean;
  getParams?: (
    pathParams: Record<string, string | undefined>,
    queryParams: Record<string, string | undefined>,
  ) => T;
  buildPath: (params: T) => string;
}
