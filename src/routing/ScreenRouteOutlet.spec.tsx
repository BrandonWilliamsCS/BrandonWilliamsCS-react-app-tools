import { render, screen } from "@testing-library/react";
import React from "react";
import { buildTestRouterWrapper } from "../testUtils/buildTestRouterWrapper";
import { ScreenRouteSpecification } from "./ScreenRouteSpecification";
import { ScreenRouteOutlet } from "./ScreenRouteOutlet";

describe("ScreenRouteOutlet", () => {
  it("renders content function results based on merged route params", () => {
    // Arrange
    const spec: ScreenRouteSpecification<string> = {
      content: (params) => `ScreenContent(${params})`,
      pathMatch: "/TestPage/:id",
      buildPath: () => "TestPage",
      getParams: (pathParams, queryParams) =>
        `PathId:${pathParams.id},QueryId:${queryParams.id}`,
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/TestPage/123?id=456";

    // Act
    render(
      <ScreenRouteOutlet
        specification={spec}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({
          initialLocation,
          pathMatch: spec.pathMatch,
        }),
      },
    );

    // Assert
    const expectedContent = "ScreenContent(PathId:123,QueryId:456)";
    expect(screen.getByText(expectedContent)).toBeInTheDocument();
  });
  it("renders notFoundContent when given content function but no params merge function", () => {
    // Arrange
    const spec: ScreenRouteSpecification<string> = {
      content: (params) => `ScreenContent(${params})`,
      pathMatch: "/TestPage",
      buildPath: () => "TestPage",
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/TestPage";

    // Act
    render(
      <ScreenRouteOutlet
        specification={spec}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({ initialLocation }),
      },
    );

    // Assert
    expect(screen.getByText(notFoundContent)).toBeInTheDocument();
  });
  it("renders notFoundContent when params merge function throws", () => {
    // Arrange
    const spec: ScreenRouteSpecification<string> = {
      content: (params) => `ScreenContent(${params})`,
      pathMatch: "/TestPage",
      buildPath: () => "TestPage",
      getParams: () => {
        throw new Error("Testing Error");
      },
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/TestPage";

    // Act
    render(
      <ScreenRouteOutlet
        specification={spec}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({ initialLocation }),
      },
    );

    // Assert
    expect(screen.getByText(notFoundContent)).toBeInTheDocument();
  });
});
