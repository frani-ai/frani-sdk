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
exports.OAuthStrategy = void 0;
const container_decorator_1 = require("../../../core/di/container-decorator");
const http_1 = require("../../../core/http");
let OAuthStrategy = class OAuthStrategy {
  constructor(config) {
    this.name = "oauth";
    this.config = config || {
      clientId: process.env.OAUTH_CLIENT_ID || "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
      redirectUri: process.env.OAUTH_REDIRECT_URI || "",
      authorizationUrl: process.env.OAUTH_AUTHORIZATION_URL || "",
      tokenUrl: process.env.OAUTH_TOKEN_URL || "",
      userInfoUrl: process.env.OAUTH_USER_INFO_URL || "",
      scope: (process.env.OAUTH_SCOPE || "openid profile email").split(" "),
    };
  }
  /**
   * Valida o código de autorização OAuth
   * @param credentials - Objeto contendo o código de autorização
   * @returns Dados do usuário ou null se inválido
   */
  async validate(credentials) {
    try {
      const { code } = credentials;
      if (!code) {
        throw new http_1.BadRequestException(
          "Código de autorização é obrigatório",
        );
      }
      // Trocar código por token de acesso
      const tokenResponse = await this.exchangeCodeForToken(code);
      // Obter informações do usuário
      const userInfo = await this.getUserInfo(tokenResponse.access_token);
      return this.mapUserInfo(userInfo);
    } catch (error) {
      throw new http_1.UnauthorizedException("Falha na autenticação OAuth");
    }
  }
  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado opcional para CSRF protection
   * @returns URL de autorização
   */
  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scope?.join(" ") || "openid profile email",
    });
    if (state) {
      params.append("state", state);
    }
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }
  /**
   * Troca o código de autorização por um token de acesso
   * @param code - Código de autorização
   * @returns Resposta com tokens
   */
  async exchangeCodeForToken(code) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });
    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!response.ok) {
      throw new http_1.UnauthorizedException(
        "Falha ao trocar código por token",
      );
    }
    return response.json();
  }
  /**
   * Obtém informações do usuário usando o token de acesso
   * @param accessToken - Token de acesso
   * @returns Informações do usuário
   */
  async getUserInfo(accessToken) {
    const response = await fetch(this.config.userInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new http_1.UnauthorizedException(
        "Falha ao obter informações do usuário",
      );
    }
    return response.json();
  }
  /**
   * Mapeia as informações do provedor OAuth para IAuthUser
   * @param userInfo - Informações do usuário do provedor
   * @returns Objeto IAuthUser padronizado
   */
  mapUserInfo(userInfo) {
    return {
      id: userInfo.sub || userInfo.id,
      email: userInfo.email,
      username:
        userInfo.preferred_username || userInfo.username || userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      roles: userInfo.roles || [],
    };
  }
  /**
   * Atualiza a configuração do OAuth
   * @param config - Nova configuração
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
};
exports.OAuthStrategy = OAuthStrategy;
exports.OAuthStrategy = OAuthStrategy = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [Object]),
  ],
  OAuthStrategy,
);
//# sourceMappingURL=oauth.strategy.js.map
