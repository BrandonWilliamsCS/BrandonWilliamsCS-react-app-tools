import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ScreenRouteOutlet } from "./ScreenRouteOutlet";
import { ScreenRouteSpecification } from "./ScreenRouteSpecification";

export interface ScreenRouterProps {
  notFoundContent: React.ReactNode;
  rootRedirectTarget?: ScreenRouteSpecification;
  specifications: ScreenRouteSpecification[];
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
        <ScreenRouteOutlet
          key={specification.pathMatch}
          specification={specification}
          notFoundContent={notFoundContent}
        />
      ))}
      <Route path="*">{notFoundContent}</Route>
    </Switch>
  );
};
