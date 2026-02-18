import { Module } from "@core/di/container-decorator";
import { ConfigService } from "./config.service";
import {
  IConfigModuleOptions,
  IDynamicModule,
} from "./interfaces/config.interface";
import { Container } from "@core/di/container";

@Module({
  providers: [ConfigService],
})
export class ConfigModule {
  /**
   * Configura o módulo de forma dinâmica (similar ao NestJS)
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(
    options?: IConfigModuleOptions,
  ): typeof ConfigModule & { __dynamic: IDynamicModule } {
    // Criar instância do ConfigService com opções
    const configOptions: { envFilePath?: string; ignoreEnvFile?: boolean } = {};
    if (options?.envFilePath !== undefined) {
      configOptions.envFilePath = options.envFilePath;
    }
    if (options?.ignoreEnvFile !== undefined) {
      configOptions.ignoreEnvFile = options.ignoreEnvFile;
    }
    const configService = new ConfigService(configOptions);

    // Carregar configurações estáticas
    if (options?.load) {
      options.load.forEach((loadFn) => {
        const config = loadFn();
        configService.load(config);
      });
    }

    // Registrar no container
    Container.register(ConfigService, configService);

    // Retornar módulo com metadata dinâmica
    const dynamicModule = ConfigModule as any;
    dynamicModule.__dynamic = {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };

    return dynamicModule;
  }

  /**
   * Configura o módulo de forma assíncrona
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static async forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<IConfigModuleOptions> | IConfigModuleOptions;
    inject?: any[];
  }): Promise<typeof ConfigModule & { __dynamic: IDynamicModule }> {
    // Resolver dependências
    const dependencies =
      options.inject?.map((dep) => Container.resolve(dep)) || [];

    // Executar factory
    const factoryResult = await options.useFactory(...dependencies);

    // Usar forRoot com o resultado
    return ConfigModule.forRoot(factoryResult);
  }
}
