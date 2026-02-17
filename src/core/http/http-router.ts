import url from "url";
import { getMetadata } from "../metadata"
import { IRouter } from "./interfaces/http.interface";
import { IncomingMessage, ServerResponse } from "http";
import { IInterceptor } from "./interfaces/interceptor.interface";
import { IExceptionFilter, HttpContext } from "./interfaces/exception-filter.interface";
import { HttpException, InternalServerErrorException } from "./exceptions/http-exception";
import { Container } from "../di/container";

export class Router {
  private routes: (IRouter & { interceptor?: any })[] = []
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

    console.log(`\n🛣️  Mapping routes for ${controllerInstance.constructor.name}:`);

    controllerMeta.routes.forEach((route: IRouter & { handlerName: string; interceptor?: any }) => {
      // Normalize path: ensure it starts with / and doesn't have double slashes
      const normalizedBasePath = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
      const normalizedRoutePath = route.path.replace(/^\/+|\/+$/g, '');
      const fullPath = normalizedRoutePath ? `${normalizedBasePath}/${normalizedRoutePath}` : normalizedBasePath || '/';

      // Check if there's an interceptor for this route (from decorator metadata)
      let interceptor = route.interceptor;
      if (!interceptor && controllerMeta.interceptors && controllerMeta.interceptors[route.handlerName]) {
        interceptor = controllerMeta.interceptors[route.handlerName];
      }

      // Check if there's a status code for this route (from decorator metadata)
      let statusCode = route.statusCode;
      if (!statusCode && controllerMeta.statusCodes && controllerMeta.statusCodes[route.handlerName]) {
        statusCode = controllerMeta.statusCodes[route.handlerName];
      }

      console.log(`   └─ ${route.method.padEnd(6)} ${fullPath} → ${route.handlerName}()${interceptor ? ' [interceptor]' : ''}`);

      this.routes.push({
        method: route.method,
        path: fullPath,
        handler: (controllerInstance as any)[route.handlerName].bind(controllerInstance),
        interceptor: interceptor ? Container.resolve(interceptor) : undefined,
        statusCode: statusCode ?? 200,
      })
    })
  }

  async handle(request: IncomingMessage & { url: string }, response: ServerResponse) {
    const parseUrl = url.parse(request.url, true);
    const route = this.routes.find(route => route.method === request.method && route.path === parseUrl.pathname)

    if (route) {
      let body = "";
      request.on("data", (chunk: unknown) => (body += chunk));
      request.on("end", async () => {
        try {
          const json = body ? JSON.parse(body) : {};
          const context: HttpContext = { request, response, body: json };

          // Execute global interceptor first
          if (this.globalInterceptor) {
            const canContinue = await this.globalInterceptor.intercept(context);
            if (!canContinue) {
              if (!response.writableEnded) {
                response.writeHead(403, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Forbidden", message: "Request blocked by interceptor" }));
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
                response.end(JSON.stringify({ error: "Forbidden", message: "Request blocked by interceptor" }));
              }
              return;
            }
          }

          // Execute the route handler
          const result = await route.handler(context);

          if (!response.writableEnded) {
            response.writeHead(route.statusCode ?? 200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(result));
          }
        } catch (error) {
          await this.handleException(error, { request, response, body: body ? JSON.parse(body) : {} });
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
        error.message || "An unexpected error occurred"
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
      response.writeHead(httpException.statusCode, { "Content-Type": "application/json" });
      response.end(JSON.stringify(httpException.toJSON()));
    }
  }
}