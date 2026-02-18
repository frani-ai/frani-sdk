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
const container_1 = require("../../core/di/container");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const oauth_strategy_1 = require("./strategies/oauth.strategy");
const openid_strategy_1 = require("./strategies/openid.strategy");
const http_1 = require("../../core/http");
const logger_service_1 = require("../logger/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthService = class AuthService {
  constructor(logger) {
    this.logger = logger;
    this.strategies = new Map();
    // Registrar estratégias disponíveis dinamicamente
    this.loadStrategies();
  }
  /**
   * Carrega estratégias disponíveis do Container
   */
  loadStrategies() {
    // Verificar quais estratégias foram registradas no Container
    const containerInstances = container_1.Container.instances;
    // Carregar apenas estratégias que foram explicitamente registradas
    if (containerInstances.has(jwt_strategy_1.JwtStrategy)) {
      const jwtStrategy = container_1.Container.resolve(
        jwt_strategy_1.JwtStrategy,
      );
      this.registerStrategy(jwtStrategy);
    }
    if (containerInstances.has(oauth_strategy_1.OAuthStrategy)) {
      const oauthStrategy = container_1.Container.resolve(
        oauth_strategy_1.OAuthStrategy,
      );
      this.registerStrategy(oauthStrategy);
    }
    if (containerInstances.has(openid_strategy_1.OpenIDStrategy)) {
      const openidStrategy = container_1.Container.resolve(
        openid_strategy_1.OpenIDStrategy,
      );
      this.registerStrategy(openidStrategy);
    }
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
   * Gera par de tokens (access + refresh) para um usuário.
   * Use no seu backend após validar credenciais (login) ou após OAuth/OpenID.
   * @param user - Usuário (sem senha)
   * @returns accessToken, refreshToken e tokenType
   */
  generateTokenPair(user) {
    const jwtStrategy = this.getStrategy("jwt");
    if (!jwtStrategy) {
      throw new http_1.BadRequestException(
        "Estratégia JWT não está habilitada",
      );
    }
    const tokens = jwtStrategy.generateTokenPair(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: "Bearer",
    };
  }
  /**
   * Obtém usuário do provedor OAuth (troca code por token e user info).
   * O backend usa onOAuthCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário retornados pelo provedor
   */
  async getOAuthUserFromCode(code, state) {
    try {
      const credentials = { code };
      if (state !== undefined) {
        credentials.state = state;
      }
      const oauthStrategy = this.getStrategy("oauth");
      const user = await oauthStrategy.validate(credentials);
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
   * Obtém usuário do provedor OpenID (troca code por token e user info).
   * O backend usa onOpenIDCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário retornados pelo provedor
   */
  async getOpenIDUserFromCode(code, state, nonce) {
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
      const openidStrategy = this.getStrategy("openid");
      const user = await openidStrategy.validate(credentials);
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
    const jwtStrategy = this.getStrategy("jwt");
    return jwtStrategy.validate({ token });
  }
  /**
   * Atualiza o token de acesso usando um refresh token
   * @param refreshToken - Refresh token
   * @returns Novo token de acesso
   */
  async refreshAccessToken(refreshToken) {
    try {
      const jwtStrategy = this.getStrategy("jwt");
      const user = await jwtStrategy.validate({ token: refreshToken });
      if (!user) {
        throw new http_1.UnauthorizedException("Refresh token inválido");
      }
      const accessToken = jwtStrategy.sign(user);
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
    const oauthStrategy = this.getStrategy("oauth");
    return oauthStrategy.getAuthorizationUrl(state);
  }
  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getOpenIDAuthorizationUrl(state, nonce) {
    const openidStrategy = this.getStrategy("openid");
    return openidStrategy.getAuthorizationUrl(state, nonce);
  }
  /**
   * Verifica se um token JWT está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isTokenExpired(token) {
    const jwtStrategy = this.getStrategy("jwt");
    return jwtStrategy.isExpired(token);
  }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.Logger]),
  ],
  AuthService,
);
//# sourceMappingURL=auth.service.js.map
