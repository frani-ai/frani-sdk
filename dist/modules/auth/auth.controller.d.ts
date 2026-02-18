import { AuthService } from "./auth.service";
import { HttpContext } from "../../core/http/interfaces/exception-filter.interface";
import { Logger } from "../logger/logger.service";
export declare class AuthController {
  private readonly authService;
  private readonly logger;
  constructor(authService: AuthService, logger: Logger);
  /**
   * Endpoint de login com credenciais (email/senha)
   * POST /auth/login
   */
  login(context: HttpContext): Promise<{
    success: boolean;
    data: import(".").ITokenResponse;
  }>;
  /**
   * Endpoint para atualizar o token de acesso
   * POST /auth/refresh
   */
  refresh(context: HttpContext): Promise<{
    success: boolean;
    data: import(".").ITokenResponse;
  }>;
  /**
   * Endpoint para obter a URL de autorização OAuth
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
   * Endpoint de callback OAuth
   * GET /auth/oauth/callback
   */
  oauthCallback(context: HttpContext): Promise<{
    success: boolean;
    data: {
      user: import(".").IAuthUser;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    };
  }>;
  /**
   * Endpoint para obter a URL de autorização OpenID Connect
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
   * Endpoint de callback OpenID Connect
   * GET /auth/openid/callback
   */
  openidCallback(context: HttpContext): Promise<{
    success: boolean;
    data: {
      user: import(".").IAuthUser;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    };
  }>;
  /**
   * Endpoint para validar um token
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
   * Endpoint para obter informações do usuário autenticado
   * GET /auth/me
   */
  me(context: HttpContext): Promise<{
    success: boolean;
    data: any;
  }>;
  /**
   * Gera um estado aleatório para CSRF protection
   */
  private generateState;
  /**
   * Gera um nonce aleatório para validação do ID token
   */
  private generateNonce;
}
//# sourceMappingURL=auth.controller.d.ts.map
