import { Module } from "@core/di/container-decorator";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OAuthStrategy } from "./strategies/oauth.strategy";
import { OpenIDStrategy } from "./strategies/openid.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { LoggerModule } from "../logger/logger.module";
import {
  IJwtConfig,
  IOAuthConfig,
  IOpenIDConfig,
} from "./interfaces/auth.interface";
import { IDynamicModule } from "../config/interfaces/config.interface";
import { Container } from "@core/di/container";
import { ConfigService } from "../config/config.service";

export type AuthStrategy = "jwt" | "oauth" | "openid";

export interface IAuthModuleOptions {
  /**
   * Estratégias de autenticação a serem habilitadas
   * @default ['jwt'] - Apenas JWT por padrão
   */
  strategies?: AuthStrategy[];

  jwt?: IJwtConfig;
  oauth?: IOAuthConfig;
  openid?: IOpenIDConfig;
}

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [],
})
export class AuthModule {
  /**
   * Configura o módulo de autenticação de forma dinâmica
   * Similar ao NestJS: AuthModule.forRoot({ strategies: ['jwt'], jwt: { secret: '...' } })
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(
    options?: IAuthModuleOptions,
  ): typeof AuthModule & { __dynamic: IDynamicModule } {
    // Estratégias habilitadas (padrão: apenas JWT)
    const enabledStrategies = options?.strategies || ["jwt"];

    // Lista de providers dinâmicos (apenas serviços; rotas ficam na sua aplicação)
    const providers: any[] = [AuthService, JwtAuthGuard, RolesGuard];
    const exports: any[] = [AuthService, JwtAuthGuard, RolesGuard];

    // Criar e registrar apenas as estratégias habilitadas
    if (enabledStrategies.includes("jwt")) {
      const jwtStrategy = new JwtStrategy(options?.jwt);
      Container.register(JwtStrategy, jwtStrategy);
      providers.push(JwtStrategy);
      exports.push(JwtStrategy);
    }

    if (enabledStrategies.includes("oauth")) {
      const oauthStrategy = new OAuthStrategy(options?.oauth);
      Container.register(OAuthStrategy, oauthStrategy);
      providers.push(OAuthStrategy);
      exports.push(OAuthStrategy);
    }

    if (enabledStrategies.includes("openid")) {
      const openidStrategy = new OpenIDStrategy(options?.openid);
      Container.register(OpenIDStrategy, openidStrategy);
      providers.push(OpenIDStrategy);
      exports.push(OpenIDStrategy);
    }

    // Retornar módulo com metadata dinâmica
    const dynamicModule = AuthModule as any;
    dynamicModule.__dynamic = {
      module: AuthModule,
      imports: [LoggerModule],
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
  static forRootAsync(options?: {
    useFactory?: (
      configService: ConfigService,
      ...args: any[]
    ) => IAuthModuleOptions;
    inject?: any[];
  }): typeof AuthModule & { __dynamic: IDynamicModule } {
    // Resolver ConfigService
    const configService = Container.resolve(ConfigService);

    // Executar factory se fornecida
    let authOptions: IAuthModuleOptions = {};
    if (options?.useFactory) {
      const dependencies = (options.inject || []).map((dep) =>
        Container.resolve(dep),
      );
      authOptions = options.useFactory(configService, ...dependencies);
    } else {
      // Determinar estratégias habilitadas via variável de ambiente
      const strategiesEnv = configService.get("AUTH_STRATEGIES", "jwt");
      const strategies = strategiesEnv
        .split(",")
        .map((s: string) => s.trim()) as AuthStrategy[];

      // Carregar configurações do ConfigService automaticamente
      authOptions = {
        strategies,
        jwt: {
          secret: configService.get(
            "JWT_SECRET",
            "default-secret-change-in-production",
          ),
          expiresIn: configService.get("JWT_EXPIRES_IN", "1h"),
          algorithm: configService.get("JWT_ALGORITHM", "HS256") as any,
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

    return AuthModule.forRoot(authOptions);
  }
}
