import {
  OAuthUserResolver,
  OpenIDUserResolver,
} from "./interfaces/auth.interface";
/**
 * Configuração do AuthModule (callbacks OAuth/OpenID).
 * Registrada pelo forRoot/forRootAsync para o controller usar.
 */
export declare class AuthModuleConfig {
  readonly onOAuthCallback?: OAuthUserResolver | undefined;
  readonly onOpenIDCallback?: OpenIDUserResolver | undefined;
  constructor(
    onOAuthCallback?: OAuthUserResolver | undefined,
    onOpenIDCallback?: OpenIDUserResolver | undefined,
  );
}
//# sourceMappingURL=auth-module.config.d.ts.map
