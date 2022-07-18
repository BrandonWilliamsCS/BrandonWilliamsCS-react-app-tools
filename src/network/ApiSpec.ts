export interface ApiSpec<Q, R> {
  method: "get" | "post";
  path: string;
  unathenticated?: boolean;
  blobResponse?: boolean;
}
