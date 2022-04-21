import { ApiSpec } from "./ApiSpec";

export interface ApiService {
  callApi<R>(spec: ApiSpec<void, R>, data?: void): Promise<R>;
  callApi<Q, R>(spec: ApiSpec<Q, R>, data: Q): Promise<R>;
}
