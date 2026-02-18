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
exports.JwtStrategy = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const container_decorator_1 = require("../../../core/di/container-decorator");
let JwtStrategy = class JwtStrategy {
  constructor(config) {
    this.name = "jwt";
    this.config = config || {
      secret: process.env.JWT_SECRET || "default-secret-change-in-production",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      algorithm: "HS256",
    };
  }
  /**
   * Valida um token JWT
   * @param credentials - Objeto contendo o token JWT
   * @returns Dados do usuário ou null se inválido
   */
  async validate(credentials) {
    try {
      const { token } = credentials;
      if (!token) {
        return null;
      }
      const decoded = jsonwebtoken_1.default.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm || "HS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
      return this.payloadToUser(decoded);
    } catch (error) {
      return null;
    }
  }
  /**
   * Gera um token JWT para um usuário
   * @param user - Dados do usuário
   * @returns Token JWT assinado
   */
  sign(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    };
    const options = {
      expiresIn: this.config.expiresIn || "1h",
      algorithm: this.config.algorithm || "HS256",
    };
    if (this.config.issuer) {
      options.issuer = this.config.issuer;
    }
    if (this.config.audience) {
      options.audience = this.config.audience;
    }
    return jsonwebtoken_1.default.sign(payload, this.config.secret, options);
  }
  /**
   * Gera um par de tokens (access e refresh)
   * @param user - Dados do usuário
   * @returns Objeto com accessToken e refreshToken
   */
  generateTokenPair(user) {
    const accessToken = this.sign(user);
    const refreshPayload = {
      sub: user.id,
      type: "refresh",
    };
    const refreshToken = jsonwebtoken_1.default.sign(
      refreshPayload,
      this.config.secret,
      {
        expiresIn: "7d", // Refresh token válido por 7 dias
        algorithm: this.config.algorithm || "HS256",
      },
    );
    return { accessToken, refreshToken };
  }
  /**
   * Valida e decodifica um token sem verificar a assinatura
   * @param token - Token JWT
   * @returns Payload decodificado ou null
   */
  decode(token) {
    try {
      return jsonwebtoken_1.default.decode(token);
    } catch (error) {
      return null;
    }
  }
  /**
   * Verifica se um token está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isExpired(token) {
    const decoded = this.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return decoded.exp * 1000 < Date.now();
  }
  /**
   * Atualiza a configuração do JWT
   * @param config - Nova configuração
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
  payloadToUser(payload) {
    const user = {
      id: payload.sub,
    };
    if (payload.email) user.email = payload.email;
    if (payload.username) user.username = payload.username;
    if (payload.roles) user.roles = payload.roles;
    return user;
  }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [Object]),
  ],
  JwtStrategy,
);
//# sourceMappingURL=jwt.strategy.js.map
