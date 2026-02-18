"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard =
  exports.JwtAuthGuard =
  exports.OpenIDStrategy =
  exports.OAuthStrategy =
  exports.JwtStrategy =
  exports.AuthController =
  exports.AuthService =
  exports.AuthModule =
    void 0;
// Module
var auth_module_1 = require("./auth.module");
Object.defineProperty(exports, "AuthModule", {
  enumerable: true,
  get: function () {
    return auth_module_1.AuthModule;
  },
});
// Service
var auth_service_1 = require("./auth.service");
Object.defineProperty(exports, "AuthService", {
  enumerable: true,
  get: function () {
    return auth_service_1.AuthService;
  },
});
// Controller
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthController", {
  enumerable: true,
  get: function () {
    return auth_controller_1.AuthController;
  },
});
// Strategies
var jwt_strategy_1 = require("./strategies/jwt.strategy");
Object.defineProperty(exports, "JwtStrategy", {
  enumerable: true,
  get: function () {
    return jwt_strategy_1.JwtStrategy;
  },
});
var oauth_strategy_1 = require("./strategies/oauth.strategy");
Object.defineProperty(exports, "OAuthStrategy", {
  enumerable: true,
  get: function () {
    return oauth_strategy_1.OAuthStrategy;
  },
});
var openid_strategy_1 = require("./strategies/openid.strategy");
Object.defineProperty(exports, "OpenIDStrategy", {
  enumerable: true,
  get: function () {
    return openid_strategy_1.OpenIDStrategy;
  },
});
// Guards
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
Object.defineProperty(exports, "JwtAuthGuard", {
  enumerable: true,
  get: function () {
    return jwt_auth_guard_1.JwtAuthGuard;
  },
});
var roles_guard_1 = require("./guards/roles.guard");
Object.defineProperty(exports, "RolesGuard", {
  enumerable: true,
  get: function () {
    return roles_guard_1.RolesGuard;
  },
});
// Interfaces
__exportStar(require("./interfaces/auth.interface"), exports);
// DTOs
__exportStar(require("./dto/login.dto"), exports);
//# sourceMappingURL=index.js.map
