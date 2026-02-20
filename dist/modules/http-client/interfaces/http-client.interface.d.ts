import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface IHttpClientModuleOptions {
  /**
   * URL base para todas as requisições (ex: https://api.example.com/v1)
   */
  baseURL?: string;
  /**
   * Headers padrão enviados em toda requisição
   */
  headers?: Record<string, string>;
  /**
   * Timeout padrão em ms
   */
  timeout?: number;
}
export interface IHttpClientService {
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
}
//# sourceMappingURL=http-client.interface.d.ts.map
