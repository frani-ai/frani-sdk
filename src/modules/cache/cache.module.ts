import { CacheConnectionService } from "./cache-connection.service";
import { ICacheModuleOptions } from "./interfaces/cache.interface";
import { Container, Module } from "@core/index";
import { ConfigService } from "../config";
import { IDynamicModule } from "../config/interfaces/config.interface";

@Module({
  providers: [],
})
export class CacheModule {
  /**
   * Registra o módulo com opções estáticas (url e/ou opções do Redis).
   */
  static forRoot(
    options?: ICacheModuleOptions,
  ): typeof CacheModule & { __dynamic: IDynamicModule } {
    const opts = options ?? {};
    const service = new CacheConnectionService(opts);
    Container.register(CacheConnectionService, service);

    const dynamicModule = CacheModule as typeof CacheModule & {
      __dynamic: IDynamicModule;
    };
    dynamicModule.__dynamic = {
      module: CacheModule,
      providers: [CacheConnectionService],
      exports: [CacheConnectionService],
    };
    return dynamicModule;
  }

  /**
   * Registra o módulo usando ConfigService (variáveis de ambiente).
   * Variáveis: REDIS_URL (opcional), REDIS_OPTIONS (JSON opcional)
   */
  static forRootAsync(options?: {
    useFactory?: (config: ConfigService, ...args: any[]) => ICacheModuleOptions;
    inject?: any[];
  }): typeof CacheModule & { __dynamic: IDynamicModule } {
    const configService = Container.resolve(ConfigService);

    let opts: ICacheModuleOptions;
    if (options?.useFactory) {
      const deps = (options.inject ?? []).map((d) => Container.resolve(d));
      opts = options.useFactory(configService, ...deps);
    } else {
      const url = configService.get<string>("REDIS_URL");
      let connectionOptions: ICacheModuleOptions["options"] = undefined;
      const optionsStr = configService.get<string>("REDIS_OPTIONS");
      if (optionsStr) {
        try {
          const parsed = JSON.parse(optionsStr);
          if (typeof parsed === "object" && parsed !== null) {
            connectionOptions = parsed;
          }
        } catch (_) {
          // ignorar JSON inválido
        }
      }
      opts =
        url !== undefined
          ? connectionOptions !== undefined
            ? { url, options: connectionOptions }
            : { url }
          : connectionOptions !== undefined
            ? { options: connectionOptions }
            : {};
    }

    return CacheModule.forRoot(opts);
  }
}
