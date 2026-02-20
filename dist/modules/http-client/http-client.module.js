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
var HttpClientModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientModule = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const container_1 = require("../../core/di/container");
const config_service_1 = require("../config/config.service");
const http_client_service_1 = require("./http-client.service");
let HttpClientModule = (HttpClientModule_1 = class HttpClientModule {
  /**
   * Registra o módulo com opções estáticas (baseURL, headers, timeout).
   */
  static forRoot(options) {
    const service = new http_client_service_1.HttpClientService(options);
    container_1.Container.register(
      http_client_service_1.HttpClientService,
      service,
    );
    const dynamicModule = HttpClientModule_1;
    dynamicModule.__dynamic = {
      module: HttpClientModule_1,
      providers: [http_client_service_1.HttpClientService],
      exports: [http_client_service_1.HttpClientService],
    };
    return dynamicModule;
  }
  /**
   * Registra o módulo usando ConfigService (variáveis de ambiente).
   * Variáveis: HTTP_CLIENT_BASE_URL, HTTP_CLIENT_HEADERS (JSON), HTTP_CLIENT_TIMEOUT
   */
  static forRootAsync(options) {
    const configService = container_1.Container.resolve(
      config_service_1.ConfigService,
    );
    let opts;
    if (options?.useFactory) {
      const deps = (options.inject ?? []).map((d) =>
        container_1.Container.resolve(d),
      );
      opts = options.useFactory(configService, ...deps);
    } else {
      const baseURL = configService.get("HTTP_CLIENT_BASE_URL", "");
      const timeout = configService.getNumber("HTTP_CLIENT_TIMEOUT", 10000);
      let headers = {};
      const headersStr = configService.get("HTTP_CLIENT_HEADERS");
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
    return HttpClientModule_1.forRoot(opts);
  }
});
exports.HttpClientModule = HttpClientModule;
exports.HttpClientModule =
  HttpClientModule =
  HttpClientModule_1 =
    __decorate(
      [
        (0, container_decorator_1.Module)({
          providers: [],
        }),
      ],
      HttpClientModule,
    );
//# sourceMappingURL=http-client.module.js.map
