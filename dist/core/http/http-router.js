"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const url_1 = __importDefault(require("url"));
const metadata_1 = require("../metadata");
const http_exception_1 = require("./exceptions/http-exception");
const container_1 = require("../di/container");
class Router {
  constructor() {
    this.routes = [];
  }
  setGlobalInterceptor(interceptor) {
    this.globalInterceptor = interceptor;
  }
  setGlobalExceptionFilter(filter) {
    this.globalExceptionFilter = filter;
  }
  registerController(controllerInstance) {
    const controllerMeta = (0, metadata_1.getMetadata)(
      controllerInstance.constructor,
    );
    if (!controllerMeta) return;
    const basePath = controllerMeta.basePath || "";
    console.log(
      `\n🛣️  Mapping routes for ${controllerInstance.constructor.name}:`,
    );
    controllerMeta.routes.forEach((route) => {
      // Normalize path: ensure it starts with / and doesn't have double slashes
      const normalizedBasePath = basePath
        ? `/${basePath.replace(/^\/+|\/+$/g, "")}`
        : "";
      const normalizedRoutePath = route.path.replace(/^\/+|\/+$/g, "");
      const fullPath = normalizedRoutePath
        ? `${normalizedBasePath}/${normalizedRoutePath}`
        : normalizedBasePath || "/";
      // Check if there's an interceptor for this route (from decorator metadata)
      let interceptor = route.interceptor;
      if (
        !interceptor &&
        controllerMeta.interceptors &&
        controllerMeta.interceptors[route.handlerName]
      ) {
        interceptor = controllerMeta.interceptors[route.handlerName];
      }
      // Check if there's a status code for this route (from decorator metadata)
      let statusCode = route.statusCode;
      if (
        !statusCode &&
        controllerMeta.statusCodes &&
        controllerMeta.statusCodes[route.handlerName]
      ) {
        statusCode = controllerMeta.statusCodes[route.handlerName];
      }
      console.log(
        `   └─ ${route.method.padEnd(6)} ${fullPath} → ${route.handlerName}()${interceptor ? " [interceptor]" : ""}`,
      );
      this.routes.push({
        method: route.method,
        path: fullPath,
        handler: controllerInstance[route.handlerName].bind(controllerInstance),
        interceptor: interceptor
          ? container_1.Container.resolve(interceptor)
          : undefined,
        statusCode: statusCode ?? 200,
      });
    });
  }
  async handle(request, response) {
    const parseUrl = url_1.default.parse(request.url, true);
    const route = this.routes.find(
      (route) =>
        route.method === request.method && route.path === parseUrl.pathname,
    );
    if (route) {
      let body = "";
      request.on("data", (chunk) => (body += chunk));
      request.on("end", async () => {
        try {
          const json = body ? JSON.parse(body) : {};
          const context = { request, response, body: json };
          // Execute global interceptor first
          if (this.globalInterceptor) {
            const canContinue = await this.globalInterceptor.intercept(context);
            if (!canContinue) {
              if (!response.writableEnded) {
                response.writeHead(403, { "Content-Type": "application/json" });
                response.end(
                  JSON.stringify({
                    error: "Forbidden",
                    message: "Request blocked by interceptor",
                  }),
                );
              }
              return;
            }
          }
          // Execute route-specific interceptor
          if (route.interceptor) {
            const canContinue = await route.interceptor.intercept(context);
            if (!canContinue) {
              if (!response.writableEnded) {
                response.writeHead(403, { "Content-Type": "application/json" });
                response.end(
                  JSON.stringify({
                    error: "Forbidden",
                    message: "Request blocked by interceptor",
                  }),
                );
              }
              return;
            }
          }
          // Execute the route handler
          const result = await route.handler(context);
          if (!response.writableEnded) {
            response.writeHead(route.statusCode ?? 200, {
              "Content-Type": "application/json",
            });
            response.end(JSON.stringify(result));
          }
        } catch (error) {
          await this.handleException(error, {
            request,
            response,
            body: body ? JSON.parse(body) : {},
          });
        }
      });
      return true;
    }
    return false;
  }
  async handleException(error, context) {
    const { response } = context;
    // If it's an HttpException, use it directly
    let httpException;
    if (error instanceof http_exception_1.HttpException) {
      httpException = error;
    } else {
      // Convert unknown errors to InternalServerErrorException
      httpException = new http_exception_1.InternalServerErrorException(
        error.message || "An unexpected error occurred",
      );
    }
    // Use global exception filter if available
    if (this.globalExceptionFilter) {
      try {
        await this.globalExceptionFilter.catch(httpException, context);
        return;
      } catch (filterError) {
        console.error("Error in exception filter:", filterError);
      }
    }
    // Default error handling
    if (!response.writableEnded) {
      response.writeHead(httpException.statusCode, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(httpException.toJSON()));
    }
  }
}
exports.Router = Router;
//# sourceMappingURL=http-router.js.map
