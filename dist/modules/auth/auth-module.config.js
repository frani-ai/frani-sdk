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
exports.AuthModuleConfig = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
/**
 * Configuração do AuthModule (callbacks OAuth/OpenID).
 * Registrada pelo forRoot/forRootAsync para o controller usar.
 */
let AuthModuleConfig = class AuthModuleConfig {
  constructor(onOAuthCallback, onOpenIDCallback) {
    this.onOAuthCallback = onOAuthCallback;
    this.onOpenIDCallback = onOpenIDCallback;
  }
};
exports.AuthModuleConfig = AuthModuleConfig;
exports.AuthModuleConfig = AuthModuleConfig = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function]),
  ],
  AuthModuleConfig,
);
//# sourceMappingURL=auth-module.config.js.map
