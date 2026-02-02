import { defineMetadata, getMetadata } from "../metadata";

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
