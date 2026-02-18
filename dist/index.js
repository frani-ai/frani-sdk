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
  exports.AuthService =
  exports.AuthModule =
  exports.ConfigService =
  exports.ConfigModule =
  exports.Logger =
  exports.DependencyContainer =
  exports.Container =
  exports.Inject =
  exports.Module =
  exports.Injectable =
  exports.Interceptor =
  exports.Catch =
  exports.HttpStatus =
  exports.Delete =
  exports.Put =
  exports.Post =
  exports.Get =
  exports.Controller =
  exports.Router =
  exports.HttpServer =
    void 0;
// Core exports
__exportStar(require("./core"), exports);
// Modules exports
__exportStar(require("./modules"), exports);
// Re-export commonly used items for convenience
var http_server_1 = require("./core/http/http-server");
Object.defineProperty(exports, "HttpServer", {
  enumerable: true,
  get: function () {
    return http_server_1.HttpServer;
  },
});
var http_router_1 = require("./core/http/http-router");
Object.defineProperty(exports, "Router", {
  enumerable: true,
  get: function () {
    return http_router_1.Router;
  },
});
var http_decorator_1 = require("./core/http/http-decorator");
Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Controller;
  },
});
Object.defineProperty(exports, "Get", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Get;
  },
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Post;
  },
});
Object.defineProperty(exports, "Put", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Put;
  },
});
Object.defineProperty(exports, "Delete", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Delete;
  },
});
Object.defineProperty(exports, "HttpStatus", {
  enumerable: true,
  get: function () {
    return http_decorator_1.HttpStatus;
  },
});
Object.defineProperty(exports, "Catch", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Catch;
  },
});
Object.defineProperty(exports, "Interceptor", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Interceptor;
  },
});
var container_decorator_1 = require("./core/di/container-decorator");
Object.defineProperty(exports, "Injectable", {
  enumerable: true,
  get: function () {
    return container_decorator_1.Injectable;
  },
});
Object.defineProperty(exports, "Module", {
  enumerable: true,
  get: function () {
    return container_decorator_1.Module;
  },
});
Object.defineProperty(exports, "Inject", {
  enumerable: true,
  get: function () {
    return container_decorator_1.Inject;
  },
});
var container_1 = require("./core/di/container");
Object.defineProperty(exports, "Container", {
  enumerable: true,
  get: function () {
    return container_1.Container;
  },
});
Object.defineProperty(exports, "DependencyContainer", {
  enumerable: true,
  get: function () {
    return container_1.DependencyContainer;
  },
});
var logger_service_1 = require("./modules/logger/logger.service");
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return logger_service_1.Logger;
  },
});
var config_1 = require("./modules/config");
Object.defineProperty(exports, "ConfigModule", {
  enumerable: true,
  get: function () {
    return config_1.ConfigModule;
  },
});
Object.defineProperty(exports, "ConfigService", {
  enumerable: true,
  get: function () {
    return config_1.ConfigService;
  },
});
var auth_1 = require("./modules/auth");
Object.defineProperty(exports, "AuthModule", {
  enumerable: true,
  get: function () {
    return auth_1.AuthModule;
  },
});
Object.defineProperty(exports, "AuthService", {
  enumerable: true,
  get: function () {
    return auth_1.AuthService;
  },
});
Object.defineProperty(exports, "JwtStrategy", {
  enumerable: true,
  get: function () {
    return auth_1.JwtStrategy;
  },
});
Object.defineProperty(exports, "OAuthStrategy", {
  enumerable: true,
  get: function () {
    return auth_1.OAuthStrategy;
  },
});
Object.defineProperty(exports, "OpenIDStrategy", {
  enumerable: true,
  get: function () {
    return auth_1.OpenIDStrategy;
  },
});
Object.defineProperty(exports, "JwtAuthGuard", {
  enumerable: true,
  get: function () {
    return auth_1.JwtAuthGuard;
  },
});
Object.defineProperty(exports, "RolesGuard", {
  enumerable: true,
  get: function () {
    return auth_1.RolesGuard;
  },
});
//# sourceMappingURL=index.js.map
