import { ConfigService } from "../config/config.service";
import { IDynamicModule } from "../config/interfaces/config.interface";
import { IHttpClientModuleOptions } from "./interfaces/http-client.interface";
export declare class HttpClientModule {
  /**
   * Registra o módulo com opções estáticas (baseURL, headers, timeout).
   */
  static forRoot(
    options?: IHttpClientModuleOptions,
  ): typeof HttpClientModule & {
    __dynamic: IDynamicModule;
  };
  /**
   * Registra o módulo usando ConfigService (variáveis de ambiente).
   * Variáveis: HTTP_CLIENT_BASE_URL, HTTP_CLIENT_HEADERS (JSON), HTTP_CLIENT_TIMEOUT
   */
  static forRootAsync(options?: {
    useFactory?: (
      config: ConfigService,
      ...args: any[]
    ) => IHttpClientModuleOptions;
    inject?: any[];
  }): typeof HttpClientModule & {
    __dynamic: IDynamicModule;
  };
}
//# sourceMappingURL=http-client.module.d.ts.map
