import { Controller, Get, Post } from "@core/http/http-decorator";
import { HttpStatusCode } from "@core/http/enums/htt-status.enum";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto } from "./dto/login.dto";
import { BadRequestException, UnauthorizedException } from "@core/http";
import { HttpContext } from "@core/http/interfaces/exception-filter.interface";
import { Logger } from "../logger/logger.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  /**
   * Endpoint de login com credenciais (email/senha)
   * POST /auth/login
   */
  @Post("/login")
  async login(context: HttpContext) {
    const { email, password } = context.body;

    const loginDto = new LoginDto({ email, password });
    const errors = loginDto.validate();

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(", "));
    }

    // Exemplo de validador de usuário (deve ser implementado pelo desenvolvedor)
    const userValidator = async (email: string) => {
      // Aqui você deve buscar o usuário no banco de dados
      // Este é apenas um exemplo
      return null;
    };

    const tokens = await this.authService.loginWithCredentials(
      loginDto.email || loginDto.username!,
      loginDto.password,
      userValidator,
    );

    return {
      success: true,
      data: tokens,
    };
  }

  /**
   * Endpoint para atualizar o token de acesso
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
   * Endpoint para obter a URL de autorização OAuth
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
   * Endpoint de callback OAuth
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

    const user = await this.authService.loginWithOAuth(
      code,
      state || undefined,
    );

    // Gerar tokens JWT para o usuário OAuth
    const tokens = this.authService["jwtStrategy"].generateTokenPair(user);

    return {
      success: true,
      data: {
        user,
        tokens,
      },
    };
  }

  /**
   * Endpoint para obter a URL de autorização OpenID Connect
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
   * Endpoint de callback OpenID Connect
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
    // Nonce deve ser validado do estado da sessão

    if (!code) {
      throw new BadRequestException("Código de autorização não fornecido");
    }

    const user = await this.authService.loginWithOpenID(
      code,
      state || undefined,
    );

    // Gerar tokens JWT para o usuário OpenID
    const tokens = this.authService["jwtStrategy"].generateTokenPair(user);

    return {
      success: true,
      data: {
        user,
        tokens,
      },
    };
  }

  /**
   * Endpoint para validar um token
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
   * Endpoint para obter informações do usuário autenticado
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

  /**
   * Gera um estado aleatório para CSRF protection
   */
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Gera um nonce aleatório para validação do ID token
   */
  private generateNonce(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
