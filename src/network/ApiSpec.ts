export interface ApiSpec<Q, R> {
  method: "get" | "post";
  path: string | ((requestData: Q) => string);
  bodyDataTransform?: (requestData: Q) => any;
  unathenticated?: boolean;
  blobResponse?: boolean;
}
