import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  IHttpClientModuleOptions,
  IHttpClientService,
} from "./interfaces/http-client.interface";
export declare class HttpClientService implements IHttpClientService {
  private readonly client;
  constructor(options?: IHttpClientModuleOptions);
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  /**
   * Retorna a instância do Axios para uso avançado (interceptors, etc.)
   */
  getInstance(): AxiosInstance;
}
//# sourceMappingURL=http-client.service.d.ts.map
