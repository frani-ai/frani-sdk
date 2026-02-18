"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var ConfigModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const config_service_1 = require("./config.service");
const container_1 = require("../../core/di/container");
let ConfigModule = (ConfigModule_1 = class ConfigModule {
  /**
   * Configura o módulo de forma dinâmica (similar ao NestJS)
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(options) {
    // Criar instância do ConfigService com opções
    const configOptions = {};
    if (options?.envFilePath !== undefined) {
      configOptions.envFilePath = options.envFilePath;
    }
    if (options?.ignoreEnvFile !== undefined) {
      configOptions.ignoreEnvFile = options.ignoreEnvFile;
    }
    const configService = new config_service_1.ConfigService(configOptions);
    // Carregar configurações estáticas
    if (options?.load) {
      options.load.forEach((loadFn) => {
        const config = loadFn();
        configService.load(config);
      });
    }
    // Registrar no container
    container_1.Container.register(
      config_service_1.ConfigService,
      configService,
    );
    // Retornar módulo com metadata dinâmica
    const dynamicModule = ConfigModule_1;
    dynamicModule.__dynamic = {
      module: ConfigModule_1,
      providers: [config_service_1.ConfigService],
      exports: [config_service_1.ConfigService],
    };
    return dynamicModule;
  }
  /**
   * Configura o módulo de forma assíncrona
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static async forRootAsync(options) {
    // Resolver dependências
    const dependencies =
      options.inject?.map((dep) => container_1.Container.resolve(dep)) || [];
    // Executar factory
    const factoryResult = await options.useFactory(...dependencies);
    // Usar forRoot com o resultado
    return ConfigModule_1.forRoot(factoryResult);
  }
});
exports.ConfigModule = ConfigModule;
exports.ConfigModule =
  ConfigModule =
  ConfigModule_1 =
    __decorate(
      [
        (0, container_decorator_1.Module)({
          providers: [config_service_1.ConfigService],
        }),
      ],
      ConfigModule,
    );
//# sourceMappingURL=config.module.js.map
