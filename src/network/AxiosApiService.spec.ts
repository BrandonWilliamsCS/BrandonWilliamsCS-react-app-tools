import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import { ApiSpec } from "./ApiSpec";
import { AxiosApiService } from "./AxiosApiService";

describe("AxiosApiService", () => {
  beforeAll(() => {
    // Nock only listens to http, not xhr.
    // This adds distance between "test" and "real" behavior, but is necessary.
    axios.defaults.adapter = httpAdapter;
  });
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  const baseUrl = "https://example.com/api";

  it("sends a request to the append base url and spec path", async () => {
    // Arrange
    const spec: ApiSpec<TestObject, void> = {
      method: "post",
      path: "/endpoint",
    };
    const data: TestObject = { key: "value" };
    const service = new AxiosApiService(baseUrl);
    const requestListener = jest.fn();
    interceptRequests(200, undefined, requestListener);

    // Act
    await service.callApi(spec, data);

    // Assert
    expect(requestListener).toHaveBeenLastCalledWith(
      expect.anything(),
      `${baseUrl}${spec.path}`,
      expect.anything(),
      expect.anything(),
    );
  });

  it("uses request data to compute the url when spec provides path function", async () => {
    // Arrange
    const spec: ApiSpec<TestObject, void> = {
      method: "post",
      path: (obj) => `/${obj.key}`,
    };
    const data: TestObject = { key: "value" };
    const service = new AxiosApiService(baseUrl);
    const requestListener = jest.fn();
    interceptRequests(200, undefined, requestListener);

    // Act
    await service.callApi(spec, data);

    // Assert
    expect(requestListener).toHaveBeenLastCalledWith(
      expect.anything(),
      `${baseUrl}/value`,
      expect.anything(),
      expect.anything(),
    );
  });

  it("transforms requst body before send when spec provides bodyDataTransform", async () => {
    // Arrange
    const spec: ApiSpec<TestObject, void> = {
      method: "post",
      path: "/endpoint",
      bodyDataTransform: (obj) => ({ upperKey: obj.key.toUpperCase() }),
    };
    const data: TestObject = { key: "value" };
    const service = new AxiosApiService(baseUrl);
    const requestListener = jest.fn();
    interceptRequests(200, undefined, requestListener);

    // Act
    await service.callApi(spec, data);

    // Assert
    expect(requestListener).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      { upperKey: "VALUE" },
      expect.anything(),
    );
  });

  describe("returned promise", () => {
    it("resolves on 200-level code", () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      interceptRequests(200, undefined, undefined);

      // Act
      const promise = service.callApi(spec);

      // Assert
      expect(promise).resolves.not.toThrow();
    });
    it("resolves to response data", () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      const responseData = "data";
      interceptRequests(200, responseData, undefined);

      // Act
      const promise = service.callApi(spec);

      // Assert
      expect(promise).resolves.toBe(responseData);
    });
    it("resolves to undefined rather than empty string for no-content responses", () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      const responseData = "";
      interceptRequests(200, responseData, undefined);

      // Act
      const promise = service.callApi(spec);

      // Assert
      expect(promise).resolves.toBeUndefined();
    });
    it("rejects on 400-level code", () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      interceptRequests(400, undefined, undefined);

      // Act
      const promise = service.callApi(spec);

      // Assert
      expect(promise).rejects.toThrow();
    });
    it("rejects on 500-level code", () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      interceptRequests(500, undefined, undefined);

      // Act
      const promise = service.callApi(spec);

      // Assert
      expect(promise).rejects.toThrow();
    });
  });

  describe("GET requests", () => {
    it("uses GET verb", async () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "get", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      const requestListener = jest.fn();
      interceptRequests(200, undefined, requestListener);

      // Act
      await service.callApi(spec);

      // Assert
      expect(requestListener).toHaveBeenLastCalledWith(
        "get",
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });
    it("sends request data as query params", async () => {
      // Arrange
      const spec: ApiSpec<TestObject, void> = {
        method: "get",
        path: "/endpoint",
      };
      const data: TestObject = { key: "value" };
      const service = new AxiosApiService(baseUrl);
      const requestListener = jest.fn();
      interceptRequests(200, undefined, requestListener);

      // Act
      await service.callApi(spec, data);

      // Assert
      expect(requestListener).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.stringContaining("?key=value"),
        expect.anything(),
        expect.anything(),
      );
    });
    it("serializes array data as duplicate keys", async () => {
      // Arrange
      const spec: ApiSpec<TestArrayObject, void> = {
        method: "get",
        path: "/endpoint",
      };
      const data: TestArrayObject = { keys: ["value1", "value2"] };
      const service = new AxiosApiService(baseUrl);
      const requestListener = jest.fn();
      interceptRequests(200, undefined, requestListener);

      // Act
      await service.callApi(spec, data);

      // Assert
      expect(requestListener).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.stringContaining("?keys=value1&keys=value2"),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe("POST requests", () => {
    it("uses POST verb", async () => {
      // Arrange
      const spec: ApiSpec<void, void> = { method: "post", path: "/endpoint" };
      const service = new AxiosApiService(baseUrl);
      const requestListener = jest.fn();
      interceptRequests(200, undefined, requestListener);

      // Act
      await service.callApi(spec);

      // Assert
      expect(requestListener).toHaveBeenLastCalledWith(
        "post",
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });
    it("sends request data as json body", async () => {
      // Arrange
      const spec: ApiSpec<TestObject, void> = {
        method: "post",
        path: "/endpoint",
      };
      const data: TestObject = { key: "value" };
      const service = new AxiosApiService(baseUrl);
      const requestListener = jest.fn();
      interceptRequests(200, undefined, requestListener);

      // Act
      await service.callApi(spec, data);

      // Assert
      expect(requestListener).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        data,
        expect.anything(),
      );
    });
  });
});

interface TestObject {
  key: string;
}
interface TestArrayObject {
  keys: string[];
}

function interceptRequests(
  code: number,
  data: unknown,
  onRequest?: (
    verb: string,
    uri: string,
    body: unknown,
    headers: Record<string, string>,
  ) => void,
) {
  const headers = data ? { "content-type": "application/json" } : undefined;
  nock(/.*/)
    .persist()
    .get(/.*/)
    .query(true)
    .reply(
      code,
      function (_, body) {
        onRequest?.("get", getFullPath(this), body, getHeaders(this));
        return data;
      },
      headers,
    )
    .post(/.*/)
    .reply(
      code,
      function (_, body) {
        onRequest?.("post", getFullPath(this), body, getHeaders(this));
        return data;
      },
      headers,
    );
}

function getFullPath(nockReplyThis: any): string {
  return (
    `${nockReplyThis.req.options.protocol}//${nockReplyThis.req.options.hostname}` +
    `${nockReplyThis.req.options.path}`
  );
}

function getHeaders(nockReplyThis: any): Record<string, string> {
  return nockReplyThis.req.headers;
}
