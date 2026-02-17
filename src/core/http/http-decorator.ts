import { defineMetadata, getMetadata } from "../metadata";
import { HttpStatusCode } from "./enums/htt-status.enum";

export function Controller(basePath = "") {
  return (target: any) => {
    const existingMeta = getMetadata(target) || {};
    defineMetadata(target, { ...existingMeta, basePath, routes: existingMeta.routes || [] });
  };
}

function addRoute(target: any, method: string, path: string, propertyKey: string) {
  const meta = getMetadata(target.constructor) || { routes: [] };
  meta.routes.push({ method, path, handlerName: propertyKey });
  defineMetadata(target.constructor, meta);
}

export const Get = (path: string) => (target: unknown, propertyKey: string) => {
  addRoute(target, "GET", path, propertyKey);
};

export const Post = (path: string) => (target: unknown, propertyKey: string) => {
  addRoute(target, "POST", path, propertyKey);
};

export const Put = (path: string) => (target: unknown, propertyKey: string) => {
  addRoute(target, "PUT", path, propertyKey);
};

export const Delete = (path: string) => (target: unknown, propertyKey: string) => {
  addRoute(target, "DELETE", path, propertyKey);
};

/**
 * Decorator to mark a class as an Exception Filter
 * The class must implement IExceptionFilter interface
 */
export function Catch() {
  return (target: any) => {
    defineMetadata(target, { isExceptionFilter: true });
  };
}

/**
 * Decorator to define the HTTP response status code for a route handler
 * @param statusCode - The HTTP status code to return
 */
export function HttpStatus(statusCode: HttpStatusCode) {
  return (target: any, propertyKey: string) => {
    const meta = getMetadata(target.constructor) || { routes: [] };
    const route = meta.routes.find((r: any) => r.handlerName === propertyKey);

    if (route) {
      route.statusCode = statusCode;
    } else {
      if (!meta.statusCodes) {
        meta.statusCodes = {};
      }
      meta.statusCodes[propertyKey] = statusCode;
    }

    defineMetadata(target.constructor, meta);
  };
}

/**
 * Decorator to apply an interceptor to a route handler
 * @param interceptorClass - The interceptor class that implements IInterceptor
 */
export function Interceptor(interceptorClass: any) {
  return (target: any, propertyKey: string) => {
    const meta = getMetadata(target.constructor) || { routes: [] };
    const route = meta.routes.find((r: any) => r.handlerName === propertyKey);

    if (route) {
      route.interceptor = interceptorClass;
    } else {
      // Store interceptor info temporarily if route hasn't been registered yet
      if (!meta.interceptors) {
        meta.interceptors = {};
      }
      meta.interceptors[propertyKey] = interceptorClass;
    }

    defineMetadata(target.constructor, meta);
  };


}
