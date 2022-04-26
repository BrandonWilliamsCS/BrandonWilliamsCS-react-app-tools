import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ScreenRouteOutlet } from "./ScreenRouteOutlet";
import { ScreenRouteSpecification } from "./ScreenRouteSpecification";

export interface ScreenRouterProps {
  notFoundContent: React.ReactNode;
  rootRedirectTarget?: ScreenRouteSpecification;
  specifications: ScreenRouteSpecification<any>[];
}

export const ScreenRouter: React.FC<ScreenRouterProps> = ({
  notFoundContent,
  rootRedirectTarget,
  specifications,
}) => {
  return (
    <Switch>
      {rootRedirectTarget && (
        <Route exact path="/">
          <Redirect to={rootRedirectTarget.buildPath()} />
        </Route>
      )}
      {specifications.map((specification) => (
        <Route
          key={specification.pathMatch}
          path={specification.pathMatch}
          exact={!specification.allowInexactMatch}
        >
          <ScreenRouteOutlet
            specification={specification}
            notFoundContent={notFoundContent}
          />
        </Route>
      ))}
      <Route path="*">{notFoundContent}</Route>
    </Switch>
  );
};
