import {
  IJwtConfig,
  IOAuthConfig,
  IOpenIDConfig,
} from "./interfaces/auth.interface";
import { IDynamicModule } from "../config/interfaces/config.interface";
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
export declare class AuthModule {
  /**
   * Configura o módulo de autenticação de forma dinâmica
   * Similar ao NestJS: AuthModule.forRoot({ strategies: ['jwt'], jwt: { secret: '...' } })
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(options?: IAuthModuleOptions): typeof AuthModule & {
    __dynamic: IDynamicModule;
  };
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
  }): typeof AuthModule & {
    __dynamic: IDynamicModule;
  };
}
//# sourceMappingURL=auth.module.d.ts.map
