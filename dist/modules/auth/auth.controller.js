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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_decorator_1 = require("../../core/http/http-decorator");
const auth_service_1 = require("./auth.service");
const auth_module_config_1 = require("./auth-module.config");
const login_dto_1 = require("./dto/login.dto");
const http_1 = require("../../core/http");
const logger_service_1 = require("../logger/logger.service");
/**
 * Controller de autenticação (SDK).
 * - Token: refresh e validate (geração de token fica com o seu backend via AuthService.generateTokenPair).
 * - OAuth/OpenID: authorize + callback; no callback você resolve o usuário (onOAuthCallback/onOpenIDCallback) e o SDK gera o token.
 */
let AuthController = class AuthController {
  constructor(authService, logger, authConfig) {
    this.authService = authService;
    this.logger = logger;
    this.authConfig = authConfig;
  }
  /**
   * Atualiza o token de acesso usando refresh token.
   * POST /auth/refresh
   */
  async refresh(context) {
    const { refreshToken } = context.body;
    const refreshDto = new login_dto_1.RefreshTokenDto({ refreshToken });
    const errors = refreshDto.validate();
    if (errors.length > 0) {
      throw new http_1.BadRequestException(errors.join(", "));
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
  async validate(context) {
    const authHeader = context.request.headers.authorization;
    if (!authHeader) {
      throw new http_1.UnauthorizedException("Token não fornecido");
    }
    const [, token] = authHeader.split(" ");
    if (!token) {
      throw new http_1.UnauthorizedException("Token inválido");
    }
    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new http_1.UnauthorizedException("Token inválido");
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
  async oauthAuthorize(context) {
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
  async oauthCallback(context) {
    const url = new URL(
      context.request.url,
      `http://${context.request.headers.host}`,
    );
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code) {
      throw new http_1.BadRequestException(
        "Código de autorização não fornecido",
      );
    }
    const providerUser = await this.authService.getOAuthUserFromCode(
      code,
      state || undefined,
    );
    const user = this.authConfig.onOAuthCallback
      ? await this.authConfig.onOAuthCallback(providerUser)
      : providerUser;
    if (!user) {
      throw new http_1.UnauthorizedException("Usuário não autorizado");
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
  async openidAuthorize(context) {
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
  async openidCallback(context) {
    const url = new URL(
      context.request.url,
      `http://${context.request.headers.host}`,
    );
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code) {
      throw new http_1.BadRequestException(
        "Código de autorização não fornecido",
      );
    }
    const providerUser = await this.authService.getOpenIDUserFromCode(
      code,
      state || undefined,
    );
    const user = this.authConfig.onOpenIDCallback
      ? await this.authConfig.onOpenIDCallback(providerUser)
      : providerUser;
    if (!user) {
      throw new http_1.UnauthorizedException("Usuário não autorizado");
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
  async me(context) {
    const user = context.user;
    if (!user) {
      throw new http_1.UnauthorizedException("Usuário não autenticado");
    }
    return {
      success: true,
      data: user,
    };
  }
  generateState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  generateNonce() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
};
exports.AuthController = AuthController;
__decorate(
  [
    (0, http_decorator_1.Post)("/refresh"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "refresh",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/validate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "validate",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/oauth/authorize"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "oauthAuthorize",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/oauth/callback"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "oauthCallback",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/openid/authorize"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "openidAuthorize",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/openid/callback"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "openidCallback",
  null,
);
__decorate(
  [
    (0, http_decorator_1.Get)("/me"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "me",
  null,
);
exports.AuthController = AuthController = __decorate(
  [
    (0, http_decorator_1.Controller)("auth"),
    __metadata("design:paramtypes", [
      auth_service_1.AuthService,
      logger_service_1.Logger,
      auth_module_config_1.AuthModuleConfig,
    ]),
  ],
  AuthController,
);
//# sourceMappingURL=auth.controller.js.map
