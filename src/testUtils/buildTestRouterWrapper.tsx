import { Location } from "history";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

export function buildTestRouterWrapper(options: TestRouterWrapperOptions) {
  return ({ children }: React.PropsWithChildren<{}>) => (
    <MemoryRouter initialEntries={[options.initialLocation ?? "/"]}>
      <Route
        path="*"
        render={({ location }) => {
          options.onLocationChange?.(location);
          return undefined;
        }}
      />
      {children}
    </MemoryRouter>
  );
}

export interface TestRouterWrapperOptions {
  initialLocation?: string;
  onLocationChange?: (location: Location) => void;
}
