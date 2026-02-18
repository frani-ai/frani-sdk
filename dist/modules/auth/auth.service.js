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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const oauth_strategy_1 = require("./strategies/oauth.strategy");
const openid_strategy_1 = require("./strategies/openid.strategy");
const http_1 = require("../../core/http");
const logger_service_1 = require("../logger/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthService = class AuthService {
  constructor(jwtStrategy, oauthStrategy, openidStrategy, logger) {
    this.jwtStrategy = jwtStrategy;
    this.oauthStrategy = oauthStrategy;
    this.openidStrategy = openidStrategy;
    this.logger = logger;
    this.strategies = new Map();
    // Registrar estratégias disponíveis
    this.registerStrategy(jwtStrategy);
    this.registerStrategy(oauthStrategy);
    this.registerStrategy(openidStrategy);
  }
  /**
   * Registra uma nova estratégia de autenticação
   * @param strategy - Estratégia a ser registrada
   */
  registerStrategy(strategy) {
    this.strategies.set(strategy.name, strategy);
    this.logger.log(`Estratégia de autenticação registrada: ${strategy.name}`);
  }
  /**
   * Obtém uma estratégia de autenticação pelo nome
   * @param name - Nome da estratégia
   * @returns Estratégia encontrada ou undefined
   */
  getStrategy(name) {
    return this.strategies.get(name);
  }
  /**
   * Autentica um usuário usando a estratégia JWT
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param userValidator - Função para validar credenciais no banco de dados
   * @returns Token de acesso e refresh token
   */
  async loginWithCredentials(email, password, userValidator) {
    try {
      // Buscar usuário no banco de dados
      const user = await userValidator(email);
      if (!user) {
        throw new http_1.UnauthorizedException("Credenciais inválidas");
      }
      // Verificar senha
      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new http_1.UnauthorizedException("Credenciais inválidas");
      }
      // Remover senha do objeto do usuário
      const { password: _, ...userWithoutPassword } = user;
      // Gerar tokens
      const tokens = this.jwtStrategy.generateTokenPair(userWithoutPassword);
      this.logger.log("Usuário autenticado com sucesso", { userId: user.id });
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: "Bearer",
      };
    } catch (error) {
      this.logger.error("Falha na autenticação", {
        error: error.message,
      });
      throw error;
    }
  }
  /**
   * Autentica um usuário usando OAuth
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário autenticado
   */
  async loginWithOAuth(code, state) {
    try {
      const credentials = { code };
      if (state !== undefined) {
        credentials.state = state;
      }
      const user = await this.oauthStrategy.validate(credentials);
      if (!user) {
        throw new http_1.UnauthorizedException("Falha na autenticação OAuth");
      }
      this.logger.log("Usuário autenticado via OAuth", { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error("Falha na autenticação OAuth", {
        error: error.message,
      });
      throw error;
    }
  }
  /**
   * Autentica um usuário usando OpenID Connect
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário autenticado
   */
  async loginWithOpenID(code, state, nonce) {
    try {
      const credentials = {
        code,
      };
      if (state !== undefined) {
        credentials.state = state;
      }
      if (nonce !== undefined) {
        credentials.nonce = nonce;
      }
      const user = await this.openidStrategy.validate(credentials);
      if (!user) {
        throw new http_1.UnauthorizedException(
          "Falha na autenticação OpenID Connect",
        );
      }
      this.logger.log("Usuário autenticado via OpenID Connect", {
        userId: user.id,
      });
      return user;
    } catch (error) {
      this.logger.error("Falha na autenticação OpenID Connect", {
        error: error.message,
      });
      throw error;
    }
  }
  /**
   * Valida um token JWT
   * @param token - Token JWT
   * @returns Dados do usuário ou null se inválido
   */
  async validateToken(token) {
    return this.jwtStrategy.validate({ token });
  }
  /**
   * Atualiza o token de acesso usando um refresh token
   * @param refreshToken - Refresh token
   * @returns Novo token de acesso
   */
  async refreshAccessToken(refreshToken) {
    try {
      const user = await this.jwtStrategy.validate({ token: refreshToken });
      if (!user) {
        throw new http_1.UnauthorizedException("Refresh token inválido");
      }
      const accessToken = this.jwtStrategy.sign(user);
      this.logger.log("Token atualizado com sucesso", { userId: user.id });
      return {
        accessToken,
        tokenType: "Bearer",
      };
    } catch (error) {
      this.logger.error("Falha ao atualizar token", {
        error: error.message,
      });
      throw new http_1.UnauthorizedException("Refresh token inválido");
    }
  }
  /**
   * Gera hash de senha usando bcrypt
   * @param password - Senha em texto plano
   * @param rounds - Número de rounds do salt (padrão: 10)
   * @returns Hash da senha
   */
  async hashPassword(password, rounds = 10) {
    return bcrypt_1.default.hash(password, rounds);
  }
  /**
   * Compara uma senha em texto plano com um hash
   * @param password - Senha em texto plano
   * @param hash - Hash da senha
   * @returns true se as senhas correspondem, false caso contrário
   */
  async comparePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
  }
  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns URL de autorização
   */
  getOAuthAuthorizationUrl(state) {
    return this.oauthStrategy.getAuthorizationUrl(state);
  }
  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getOpenIDAuthorizationUrl(state, nonce) {
    return this.openidStrategy.getAuthorizationUrl(state, nonce);
  }
  /**
   * Verifica se um token JWT está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isTokenExpired(token) {
    return this.jwtStrategy.isExpired(token);
  }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [
      jwt_strategy_1.JwtStrategy,
      oauth_strategy_1.OAuthStrategy,
      openid_strategy_1.OpenIDStrategy,
      logger_service_1.Logger,
    ]),
  ],
  AuthService,
);
//# sourceMappingURL=auth.service.js.map
