import axios, { AxiosInstance, AxiosResponse, ResponseType } from "axios";
import { stringify as stringifyQuery } from "query-string";
import { ApiService } from "./ApiService";
import { ApiSpec } from "./ApiSpec";

export class AxiosApiService implements ApiService {
  private readonly instance: AxiosInstance;

  constructor(baseApiUrl: string) {
    this.instance = axios.create({
      baseURL: baseApiUrl,
      withCredentials: true,
      paramsSerializer: (params) => {
        return stringifyQuery(params, { arrayFormat: "none" });
      },
    });
  }

  public async callApi<R>(spec: ApiSpec<void, R>, data?: void): Promise<R>;
  public async callApi<Q, R>(spec: ApiSpec<Q, R>, data: Q): Promise<R>;
  public async callApi<Q, R>(spec: ApiSpec<Q, R>, data: Q): Promise<R> {
    const axiosResponse = await this.baseRequest<Q, R>(
      spec.path,
      spec.method,
      data,
      spec.blobResponse ? "blob" : undefined,
    );

    // Empty data with no content type gets sent as an empty string; we want undefined.
    if (!axiosResponse.data && !axiosResponse.headers["content-type"]) {
      // Trust that the consumer knows that undefined is an option with R.
      return undefined as unknown as R;
    }
    return axiosResponse.data;
  }

  private baseRequest<Q, R>(
    url: string,
    method: "get" | "post",
    requestData: Q,
    responseType?: ResponseType,
  ): Promise<AxiosResponse<R>> {
    return method === "get"
      ? this.instance.get<R>(url, {
          params: requestData,
          responseType,
        })
      : this.instance.post<R>(url, requestData, {
          responseType,
        });
  }
}
