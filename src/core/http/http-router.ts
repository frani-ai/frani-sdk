import url from "url";
import { getMetadata } from "../metadata";
import { IRouter } from "./interfaces/http.interface";
import { IncomingMessage, ServerResponse } from "http";
import { IInterceptor } from "./interfaces/interceptor.interface";
import {
  IExceptionFilter,
  HttpContext,
} from "./interfaces/exception-filter.interface";
import {
  HttpException,
  InternalServerErrorException,
} from "./exceptions/http-exception";
import { Container } from "../di/container";

/**
 * Converte um path com :param em regex e lista de nomes.
 * Ex: "/validate/:params" → { regex: /^\/validate\/([^/]+)$/, paramNames: ["params"] }
 */
function pathPatternToRegex(pathPattern: string): {
  regex: RegExp;
  paramNames: string[];
} {
  const paramNames: string[] = [];
  const pattern = pathPattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
    return "([^/]+)";
  });
  const regex = new RegExp(`^${pattern}$`);
  return { regex, paramNames };
}

function matchPath(
  pathname: string,
  route: IRouter & { pathRegex?: RegExp; pathParamNames?: string[] },
): Record<string, string> | null {
  if (route.pathRegex && route.pathParamNames?.length) {
    const m = pathname.match(route.pathRegex);
    if (!m) return null;
    const params: Record<string, string> = {};
    route.pathParamNames.forEach((name, i) => {
      params[name] = m[i + 1] ?? "";
    });
    return params;
  }
  return route.path === pathname ? {} : null;
}

export class Router {
  private routes: (IRouter & { interceptor?: any })[] = [];
  private globalInterceptor?: IInterceptor;
  private globalExceptionFilter?: IExceptionFilter;

  setGlobalInterceptor(interceptor: IInterceptor) {
    this.globalInterceptor = interceptor;
  }

  setGlobalExceptionFilter(filter: IExceptionFilter) {
    this.globalExceptionFilter = filter;
  }

  registerController(controllerInstance: any) {
    const controllerMeta = getMetadata(controllerInstance.constructor);
    if (!controllerMeta) return;

    const basePath = controllerMeta.basePath || "";

    console.log(
      `\n🛣️  Mapping routes for ${controllerInstance.constructor.name}:`,
    );

    controllerMeta.routes.forEach(
      (route: IRouter & { handlerName: string; interceptor?: any }) => {
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

        const hasPathParams = /:[^/]+/.test(fullPath);
        const routeEntry: IRouter & { interceptor?: any } = {
          method: route.method,
          path: fullPath,
          handler: (controllerInstance as any)[route.handlerName].bind(
            controllerInstance,
          ),
          statusCode: statusCode ?? 200,
        };
        if (interceptor)
          routeEntry.interceptor = Container.resolve(interceptor);
        if (hasPathParams) {
          const { regex, paramNames } = pathPatternToRegex(fullPath);
          routeEntry.pathRegex = regex;
          routeEntry.pathParamNames = paramNames;
        }
        this.routes.push(routeEntry);
      },
    );
  }

  async handle(
    request: IncomingMessage & { url: string },
    response: ServerResponse,
  ) {
    const parseUrl = url.parse(request.url || "", true);
    const pathname = parseUrl.pathname || "/";
    const route = this.routes.find((r) => {
      if (r.method !== request.method) return false;
      const params = matchPath(pathname, r);
      return params !== null;
    });

    if (route) {
      const pathParams = matchPath(pathname, route) || {};
      let body = "";
      request.on("data", (chunk: unknown) => (body += chunk));
      request.on("end", async () => {
        try {
          const json = body ? JSON.parse(body) : {};
          const context: HttpContext = {
            request,
            response,
            body: json,
            params: pathParams,
            query: parseUrl.query as Record<string, string | string[]>,
            headers: request.headers,
            method: request.method ?? "",
            url: request.url ?? "",
            pathname: pathname ?? "/",
          };

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
            headers: request.headers,
            method: request.method ?? "",
            url: request.url ?? "",
            pathname: pathname ?? "/",
            query: parseUrl.query as Record<string, string | string[]>,
            params: pathParams,
          });
        }
      });
      return true;
    }

    return false;
  }

  private async handleException(error: any, context: HttpContext) {
    const { response } = context;

    // If it's an HttpException, use it directly
    let httpException: HttpException;
    if (error instanceof HttpException) {
      httpException = error;
    } else {
      // Convert unknown errors to InternalServerErrorException
      httpException = new InternalServerErrorException(
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
