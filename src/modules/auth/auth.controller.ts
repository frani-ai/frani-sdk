import { Controller, Get, Post } from "@core/http/http-decorator";
import { AuthService } from "./auth.service";
import { AuthModuleConfig } from "./auth-module.config";
import { RefreshTokenDto } from "./dto/login.dto";
import { BadRequestException, UnauthorizedException } from "@core/http";
import { HttpContext } from "@core/http/interfaces/exception-filter.interface";
import { Logger } from "../logger/logger.service";

/**
 * Controller de autenticação (SDK).
 * - Token: refresh e validate (geração de token fica com o seu backend via AuthService.generateTokenPair).
 * - OAuth/OpenID: authorize + callback; no callback você resolve o usuário (onOAuthCallback/onOpenIDCallback) e o SDK gera o token.
 */
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly authConfig: AuthModuleConfig,
  ) {}

  /**
   * Atualiza o token de acesso usando refresh token.
   * POST /auth/refresh
   */
  @Post("/refresh")
  async refresh(context: HttpContext) {
    const { refreshToken } = context.body;

    const refreshDto = new RefreshTokenDto({ refreshToken });
    const errors = refreshDto.validate();

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(", "));
    }

    const tokens = await this.authService.refreshAccessToken(
      refreshDto.refreshToken,
    );

    return {
      success: true,
      data: tokens,
    };
  }

  /**
   * Valida um token e retorna o usuário.
   * GET /auth/validate
   */
  @Get("/validate")
  async validate(context: HttpContext) {
    const authHeader = context.request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Token não fornecido");
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      throw new UnauthorizedException("Token inválido");
    }

    const user = await this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException("Token inválido");
    }

    return {
      success: true,
      data: {
        user,
        valid: true,
      },
    };
  }

  /**
   * Retorna a URL de autorização OAuth.
   * GET /auth/oauth/authorize
   */
  @Get("/oauth/authorize")
  async oauthAuthorize(context: HttpContext) {
    const state = this.generateState();
    const url = this.authService.getOAuthAuthorizationUrl(state);

    return {
      success: true,
      data: {
        url,
        state,
      },
    };
  }

  /**
   * Callback OAuth: troca code por usuário do provedor, chama seu onOAuthCallback (se existir) e gera tokens.
   * GET /auth/oauth/callback
   */
  @Get("/oauth/callback")
  async oauthCallback(context: HttpContext) {
    const url = new URL(
      context.request.url!,
      `http://${context.request.headers.host}`,
    );
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      throw new BadRequestException("Código de autorização não fornecido");
    }

    const providerUser = await this.authService.getOAuthUserFromCode(
      code,
      state || undefined,
    );

    const user = this.authConfig.onOAuthCallback
      ? await this.authConfig.onOAuthCallback(providerUser)
      : providerUser;

    if (!user) {
      throw new UnauthorizedException("Usuário não autorizado");
    }

    const tokens = this.authService.generateTokenPair(user);

    return {
      success: true,
      data: {
        user,
        tokens,
      },
    };
  }

  /**
   * Retorna a URL de autorização OpenID.
   * GET /auth/openid/authorize
   */
  @Get("/openid/authorize")
  async openidAuthorize(context: HttpContext) {
    const state = this.generateState();
    const nonce = this.generateNonce();
    const url = this.authService.getOpenIDAuthorizationUrl(state, nonce);

    return {
      success: true,
      data: {
        url,
        state,
        nonce,
      },
    };
  }

  /**
   * Callback OpenID: troca code por usuário do provedor, chama seu onOpenIDCallback (se existir) e gera tokens.
   * GET /auth/openid/callback
   */
  @Get("/openid/callback")
  async openidCallback(context: HttpContext) {
    const url = new URL(
      context.request.url!,
      `http://${context.request.headers.host}`,
    );
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      throw new BadRequestException("Código de autorização não fornecido");
    }

    const providerUser = await this.authService.getOpenIDUserFromCode(
      code,
      state || undefined,
    );

    const user = this.authConfig.onOpenIDCallback
      ? await this.authConfig.onOpenIDCallback(providerUser)
      : providerUser;

    if (!user) {
      throw new UnauthorizedException("Usuário não autorizado");
    }

    const tokens = this.authService.generateTokenPair(user);

    return {
      success: true,
      data: {
        user,
        tokens,
      },
    };
  }

  /**
   * Dados do usuário autenticado (requer JwtAuthGuard na rota).
   * GET /auth/me
   */
  @Get("/me")
  async me(context: HttpContext) {
    const user = (context as any).user;

    if (!user) {
      throw new UnauthorizedException("Usuário não autenticado");
    }

    return {
      success: true,
      data: user,
    };
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateNonce(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
