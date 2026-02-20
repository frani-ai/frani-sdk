import { Injectable } from "@core/di/container-decorator";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  IHttpClientModuleOptions,
  IHttpClientService,
} from "./interfaces/http-client.interface";

@Injectable()
export class HttpClientService implements IHttpClientService {
  private readonly client: AxiosInstance;

  constructor(options?: IHttpClientModuleOptions) {
    this.client = axios.create({
      baseURL: options?.baseURL ?? "",
      timeout: options?.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  /**
   * Retorna a instância do Axios para uso avançado (interceptors, etc.)
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
}
