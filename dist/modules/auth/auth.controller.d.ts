import { AuthService } from "./auth.service";
import { AuthModuleConfig } from "./auth-module.config";
import { HttpContext } from "../../core/http/interfaces/exception-filter.interface";
import { Logger } from "../logger/logger.service";
/**
 * Controller de autenticação (SDK).
 * - Token: refresh e validate (geração de token fica com o seu backend via AuthService.generateTokenPair).
 * - OAuth/OpenID: authorize + callback; no callback você resolve o usuário (onOAuthCallback/onOpenIDCallback) e o SDK gera o token.
 */
export declare class AuthController {
  private readonly authService;
  private readonly logger;
  private readonly authConfig;
  constructor(
    authService: AuthService,
    logger: Logger,
    authConfig: AuthModuleConfig,
  );
  /**
   * Atualiza o token de acesso usando refresh token.
   * POST /auth/refresh
   */
  refresh(context: HttpContext): Promise<{
    success: boolean;
    data: import(".").ITokenResponse;
  }>;
  /**
   * Valida um token e retorna o usuário.
   * GET /auth/validate
   */
  validate(context: HttpContext): Promise<{
    success: boolean;
    data: {
      user: import(".").IAuthUser;
      valid: boolean;
    };
  }>;
  /**
   * Retorna a URL de autorização OAuth.
   * GET /auth/oauth/authorize
   */
  oauthAuthorize(context: HttpContext): Promise<{
    success: boolean;
    data: {
      url: string;
      state: string;
    };
  }>;
  /**
   * Callback OAuth: troca code por usuário do provedor, chama seu onOAuthCallback (se existir) e gera tokens.
   * GET /auth/oauth/callback
   */
  oauthCallback(context: HttpContext): Promise<{
    success: boolean;
    data: {
      user: import(".").IAuthUser;
      tokens: import(".").ITokenResponse;
    };
  }>;
  /**
   * Retorna a URL de autorização OpenID.
   * GET /auth/openid/authorize
   */
  openidAuthorize(context: HttpContext): Promise<{
    success: boolean;
    data: {
      url: string;
      state: string;
      nonce: string;
    };
  }>;
  /**
   * Callback OpenID: troca code por usuário do provedor, chama seu onOpenIDCallback (se existir) e gera tokens.
   * GET /auth/openid/callback
   */
  openidCallback(context: HttpContext): Promise<{
    success: boolean;
    data: {
      user: import(".").IAuthUser;
      tokens: import(".").ITokenResponse;
    };
  }>;
  /**
   * Dados do usuário autenticado (requer JwtAuthGuard na rota).
   * GET /auth/me
   */
  me(context: HttpContext): Promise<{
    success: boolean;
    data: any;
  }>;
  private generateState;
  private generateNonce;
}
//# sourceMappingURL=auth.controller.d.ts.map
