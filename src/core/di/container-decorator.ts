import "reflect-metadata";
import { defineMetadata } from "../metadata";

export function Module(metadata: { controllers?: any[]; providers?: any[]; imports?: any[] } = {}) {
  return function (target: any) {
    defineMetadata(target, metadata);
  };
}

export function Injectable() {
  return function (target: any) {
    defineMetadata(target, { injectable: true });
  };
}

export function Inject(token: any) {
  return function (target: any, _propertyKey: string, parameterIndex: number) {
    const existingParams = Reflect.getMetadata("design:paramtypes", target) || [];
    existingParams[parameterIndex] = token;
    Reflect.defineMetadata("design:paramtypes", existingParams, target);
  }
}