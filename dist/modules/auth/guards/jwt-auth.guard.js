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
exports.JwtAuthGuard = void 0;
const container_decorator_1 = require("../../../core/di/container-decorator");
const jwt_strategy_1 = require("../strategies/jwt.strategy");
const http_1 = require("../../../core/http");
let JwtAuthGuard = class JwtAuthGuard {
  constructor(jwtStrategy) {
    this.jwtStrategy = jwtStrategy;
  }
  /**
   * Verifica se a requisição possui um token JWT válido
   * @param context - Contexto da requisição HTTP
   * @returns true se autenticado, false caso contrário
   */
  async canActivate(context) {
    try {
      const token = this.extractTokenFromHeader(context);
      if (!token) {
        throw new http_1.UnauthorizedException("Token não fornecido");
      }
      const user = await this.jwtStrategy.validate({ token });
      if (!user) {
        throw new http_1.UnauthorizedException("Token inválido");
      }
      // Adicionar usuário ao contexto para uso posterior
      context.user = user;
      return true;
    } catch (error) {
      if (error instanceof http_1.UnauthorizedException) {
        throw error;
      }
      throw new http_1.UnauthorizedException("Falha na autenticação");
    }
  }
  /**
   * Extrai o token JWT do header Authorization
   * @param context - Contexto da requisição
   * @returns Token JWT ou null
   */
  extractTokenFromHeader(context) {
    const authHeader = context.request.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
      return null;
    }
    return token;
  }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_strategy_1.JwtStrategy]),
  ],
  JwtAuthGuard,
);
//# sourceMappingURL=jwt-auth.guard.js.map
