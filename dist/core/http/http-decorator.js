"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
exports.Controller = Controller;
exports.Catch = Catch;
exports.HttpStatus = HttpStatus;
exports.Interceptor = Interceptor;
const metadata_1 = require("../metadata");
function Controller(basePath = "") {
  return (target) => {
    const existingMeta = (0, metadata_1.getMetadata)(target) || {};
    (0, metadata_1.defineMetadata)(target, {
      ...existingMeta,
      basePath,
      routes: existingMeta.routes || [],
    });
  };
}
function addRoute(target, method, path, propertyKey) {
  const meta = (0, metadata_1.getMetadata)(target.constructor) || {
    routes: [],
  };
  meta.routes.push({ method, path, handlerName: propertyKey });
  (0, metadata_1.defineMetadata)(target.constructor, meta);
}
const Get = (path) => (target, propertyKey) => {
  addRoute(target, "GET", path, propertyKey);
};
exports.Get = Get;
const Post = (path) => (target, propertyKey) => {
  addRoute(target, "POST", path, propertyKey);
};
exports.Post = Post;
const Put = (path) => (target, propertyKey) => {
  addRoute(target, "PUT", path, propertyKey);
};
exports.Put = Put;
const Delete = (path) => (target, propertyKey) => {
  addRoute(target, "DELETE", path, propertyKey);
};
exports.Delete = Delete;
/**
 * Decorator to mark a class as an Exception Filter
 * The class must implement IExceptionFilter interface
 */
function Catch() {
  return (target) => {
    (0, metadata_1.defineMetadata)(target, { isExceptionFilter: true });
  };
}
/**
 * Decorator to define the HTTP response status code for a route handler
 * @param statusCode - The HTTP status code to return
 */
function HttpStatus(statusCode) {
  return (target, propertyKey) => {
    const meta = (0, metadata_1.getMetadata)(target.constructor) || {
      routes: [],
    };
    const route = meta.routes.find((r) => r.handlerName === propertyKey);
    if (route) {
      route.statusCode = statusCode;
    } else {
      if (!meta.statusCodes) {
        meta.statusCodes = {};
      }
      meta.statusCodes[propertyKey] = statusCode;
    }
    (0, metadata_1.defineMetadata)(target.constructor, meta);
  };
}
/**
 * Decorator to apply an interceptor to a route handler
 * @param interceptorClass - The interceptor class that implements IInterceptor
 */
function Interceptor(interceptorClass) {
  return (target, propertyKey) => {
    const meta = (0, metadata_1.getMetadata)(target.constructor) || {
      routes: [],
    };
    const route = meta.routes.find((r) => r.handlerName === propertyKey);
    if (route) {
      route.interceptor = interceptorClass;
    } else {
      // Store interceptor info temporarily if route hasn't been registered yet
      if (!meta.interceptors) {
        meta.interceptors = {};
      }
      meta.interceptors[propertyKey] = interceptorClass;
    }
    (0, metadata_1.defineMetadata)(target.constructor, meta);
  };
}
//# sourceMappingURL=http-decorator.js.map
