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
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const container_decorator_1 = require("../../../core/di/container-decorator");
const http_1 = require("../../../core/http");
let RolesGuard = (RolesGuard_1 = class RolesGuard {
  constructor() {
    this.requiredRoles = [];
  }
  /**
   * Define as roles necessárias para acessar a rota
   * @param roles - Array de roles necessárias
   */
  setRequiredRoles(roles) {
    this.requiredRoles = roles;
  }
  /**
   * Verifica se o usuário possui as roles necessárias
   * @param context - Contexto da requisição HTTP
   * @returns true se autorizado, false caso contrário
   */
  async canActivate(context) {
    const user = context.user;
    if (!user) {
      throw new http_1.UnauthorizedException("Usuário não autenticado");
    }
    if (!this.requiredRoles || this.requiredRoles.length === 0) {
      return true;
    }
    const userRoles = user.roles || [];
    const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new http_1.ForbiddenException(
        "Usuário não possui permissão para acessar este recurso",
      );
    }
    return true;
  }
  /**
   * Cria uma nova instância do guard com roles específicas
   * @param roles - Array de roles necessárias
   * @returns Nova instância do RolesGuard
   */
  static forRoles(roles) {
    const guard = new RolesGuard_1();
    guard.setRequiredRoles(roles);
    return guard;
  }
});
exports.RolesGuard = RolesGuard;
exports.RolesGuard =
  RolesGuard =
  RolesGuard_1 =
    __decorate([(0, container_decorator_1.Injectable)()], RolesGuard);
//# sourceMappingURL=roles.guard.js.map
