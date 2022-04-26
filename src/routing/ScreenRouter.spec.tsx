import { render, screen } from "@testing-library/react";
import React from "react";
import { buildTestRouterWrapper } from "../testUtils/buildTestRouterWrapper";
import { ScreenRouteSpecification } from "./ScreenRouteSpecification";
import { ScreenRouter } from "./ScreenRouter";

describe("ScreenRouter", () => {
  it("renders nothing when location fails to match", () => {
    // Arrange
    const content = "ScreenContent";
    const spec: ScreenRouteSpecification = {
      content,
      pathMatch: "/TestPage",
      buildPath: () => "TestPage",
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/OtherPage";

    // Act
    render(
      <ScreenRouter
        specifications={[spec]}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({ initialLocation }),
      },
    );

    // Assert
    expect(screen.queryByText(content)).not.toBeInTheDocument();
  });
  it("renders spec content when location matches path", () => {
    // Arrange
    const content = "ScreenContent";
    const spec: ScreenRouteSpecification = {
      content,
      pathMatch: "/TestPage",
      buildPath: () => "TestPage",
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/TestPage";

    // Act
    render(
      <ScreenRouter
        specifications={[spec]}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({ initialLocation }),
      },
    );

    // Assert
    expect(screen.queryByText(content)).toBeInTheDocument();
  });
  it("honors inexact match when specified", () => {
    // Arrange
    const content = "ScreenContent";
    const spec: ScreenRouteSpecification = {
      content,
      pathMatch: "/TestPage",
      buildPath: () => "TestPage",
      allowInexactMatch: true,
    };
    const notFoundContent = "NotFoundContent";
    const initialLocation = "/TestPage/AndBeyond";

    // Act
    render(
      <ScreenRouter
        specifications={[spec]}
        notFoundContent={notFoundContent}
      />,
      {
        wrapper: buildTestRouterWrapper({ initialLocation }),
      },
    );

    // Assert
    expect(screen.queryByText(content)).toBeInTheDocument();
  });
});
