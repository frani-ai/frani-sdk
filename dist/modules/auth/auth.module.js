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
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const oauth_strategy_1 = require("./strategies/oauth.strategy");
const openid_strategy_1 = require("./strategies/openid.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const logger_module_1 = require("../logger/logger.module");
const container_1 = require("../../core/di/container");
const config_service_1 = require("../config/config.service");
let AuthModule = (AuthModule_1 = class AuthModule {
  /**
   * Configura o módulo de autenticação de forma dinâmica
   * Similar ao NestJS: AuthModule.forRoot({ strategies: ['jwt'], jwt: { secret: '...' } })
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(options) {
    // Estratégias habilitadas (padrão: apenas JWT)
    const enabledStrategies = options?.strategies || ["jwt"];
    // Lista de providers dinâmicos (apenas serviços; rotas ficam na sua aplicação)
    const providers = [
      auth_service_1.AuthService,
      jwt_auth_guard_1.JwtAuthGuard,
      roles_guard_1.RolesGuard,
    ];
    const exports = [
      auth_service_1.AuthService,
      jwt_auth_guard_1.JwtAuthGuard,
      roles_guard_1.RolesGuard,
    ];
    // Criar e registrar apenas as estratégias habilitadas
    if (enabledStrategies.includes("jwt")) {
      const jwtStrategy = new jwt_strategy_1.JwtStrategy(options?.jwt);
      container_1.Container.register(jwt_strategy_1.JwtStrategy, jwtStrategy);
      providers.push(jwt_strategy_1.JwtStrategy);
      exports.push(jwt_strategy_1.JwtStrategy);
    }
    if (enabledStrategies.includes("oauth")) {
      const oauthStrategy = new oauth_strategy_1.OAuthStrategy(options?.oauth);
      container_1.Container.register(
        oauth_strategy_1.OAuthStrategy,
        oauthStrategy,
      );
      providers.push(oauth_strategy_1.OAuthStrategy);
      exports.push(oauth_strategy_1.OAuthStrategy);
    }
    if (enabledStrategies.includes("openid")) {
      const openidStrategy = new openid_strategy_1.OpenIDStrategy(
        options?.openid,
      );
      container_1.Container.register(
        openid_strategy_1.OpenIDStrategy,
        openidStrategy,
      );
      providers.push(openid_strategy_1.OpenIDStrategy);
      exports.push(openid_strategy_1.OpenIDStrategy);
    }
    // Retornar módulo com metadata dinâmica
    const dynamicModule = AuthModule_1;
    dynamicModule.__dynamic = {
      module: AuthModule_1,
      imports: [logger_module_1.LoggerModule],
      controllers: [],
      providers,
      exports,
    };
    return dynamicModule;
  }
  /**
   * Configura o módulo usando ConfigService
   * Similar ao NestJS: AuthModule.forRootAsync({ useFactory: (config) => ({ strategies: ['jwt'], ... }) })
   * @returns Módulo dinâmico configurado
   */
  static forRootAsync(options) {
    // Resolver ConfigService
    const configService = container_1.Container.resolve(
      config_service_1.ConfigService,
    );
    // Executar factory se fornecida
    let authOptions = {};
    if (options?.useFactory) {
      const dependencies = (options.inject || []).map((dep) =>
        container_1.Container.resolve(dep),
      );
      authOptions = options.useFactory(configService, ...dependencies);
    } else {
      // Determinar estratégias habilitadas via variável de ambiente
      const strategiesEnv = configService.get("AUTH_STRATEGIES", "jwt");
      const strategies = strategiesEnv.split(",").map((s) => s.trim());
      // Carregar configurações do ConfigService automaticamente
      authOptions = {
        strategies,
        jwt: {
          secret: configService.get(
            "JWT_SECRET",
            "default-secret-change-in-production",
          ),
          expiresIn: configService.get("JWT_EXPIRES_IN", "1h"),
          algorithm: configService.get("JWT_ALGORITHM", "HS256"),
          issuer: configService.get("JWT_ISSUER"),
          audience: configService.get("JWT_AUDIENCE"),
        },
        oauth: {
          clientId: configService.get("OAUTH_CLIENT_ID", ""),
          clientSecret: configService.get("OAUTH_CLIENT_SECRET", ""),
          redirectUri: configService.get("OAUTH_REDIRECT_URI", ""),
          authorizationUrl: configService.get("OAUTH_AUTHORIZATION_URL", ""),
          tokenUrl: configService.get("OAUTH_TOKEN_URL", ""),
          userInfoUrl: configService.get("OAUTH_USER_INFO_URL", ""),
          scope: configService.getArray("OAUTH_SCOPE", [
            "openid",
            "profile",
            "email",
          ]),
        },
        openid: {
          clientId: configService.get("OPENID_CLIENT_ID", ""),
          clientSecret: configService.get("OPENID_CLIENT_SECRET", ""),
          redirectUri: configService.get("OPENID_REDIRECT_URI", ""),
          authorizationUrl: configService.get("OPENID_AUTHORIZATION_URL", ""),
          tokenUrl: configService.get("OPENID_TOKEN_URL", ""),
          userInfoUrl: configService.get("OPENID_USER_INFO_URL", ""),
          discoveryUrl: configService.get("OPENID_DISCOVERY_URL"),
          issuer: configService.get("OPENID_ISSUER"),
          jwksUri: configService.get("OPENID_JWKS_URI"),
          scope: configService.getArray("OPENID_SCOPE", [
            "openid",
            "profile",
            "email",
          ]),
        },
      };
    }
    return AuthModule_1.forRoot(authOptions);
  }
});
exports.AuthModule = AuthModule;
exports.AuthModule =
  AuthModule =
  AuthModule_1 =
    __decorate(
      [
        (0, container_decorator_1.Module)({
          imports: [logger_module_1.LoggerModule],
          controllers: [],
          providers: [],
        }),
      ],
      AuthModule,
    );
//# sourceMappingURL=auth.module.js.map
