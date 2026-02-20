import { Module } from "@core/di/container-decorator";
import { Container } from "@core/di/container";
import { ConfigService } from "../config/config.service";
import { IDynamicModule } from "../config/interfaces/config.interface";
import { HttpClientService } from "./http-client.service";
import { IHttpClientModuleOptions } from "./interfaces/http-client.interface";

@Module({
  providers: [],
})
export class HttpClientModule {
  /**
   * Registra o módulo com opções estáticas (baseURL, headers, timeout).
   */
  static forRoot(
    options?: IHttpClientModuleOptions,
  ): typeof HttpClientModule & { __dynamic: IDynamicModule } {
    const service = new HttpClientService(options);
    Container.register(HttpClientService, service);

    const dynamicModule = HttpClientModule as any;
    dynamicModule.__dynamic = {
      module: HttpClientModule,
      providers: [HttpClientService],
      exports: [HttpClientService],
    };
    return dynamicModule;
  }

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
  }): typeof HttpClientModule & { __dynamic: IDynamicModule } {
    const configService = Container.resolve(ConfigService);

    let opts: IHttpClientModuleOptions;
    if (options?.useFactory) {
      const deps = (options.inject ?? []).map((d) => Container.resolve(d));
      opts = options.useFactory(configService, ...deps);
    } else {
      const baseURL = configService.get("HTTP_CLIENT_BASE_URL", "");
      const timeout = configService.getNumber("HTTP_CLIENT_TIMEOUT", 10000);
      let headers: Record<string, string> = {};
      const headersStr = configService.get<string>("HTTP_CLIENT_HEADERS");
      if (headersStr) {
        try {
          const parsed = JSON.parse(headersStr);
          if (typeof parsed === "object" && parsed !== null) {
            headers = parsed;
          }
        } catch (_) {
          // ignorar JSON inválido
        }
      }
      opts = { baseURL, timeout, headers };
    }

    return HttpClientModule.forRoot(opts);
  }
}
