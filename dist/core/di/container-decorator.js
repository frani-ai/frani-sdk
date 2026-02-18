"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = Module;
exports.Injectable = Injectable;
exports.Inject = Inject;
require("reflect-metadata");
const metadata_1 = require("../metadata");
function Module(metadata = {}) {
  return function (target) {
    (0, metadata_1.defineMetadata)(target, metadata);
  };
}
function Injectable() {
  return function (target) {
    (0, metadata_1.defineMetadata)(target, { injectable: true });
  };
}
function Inject(token) {
  return function (target, _propertyKey, parameterIndex) {
    const existingParams =
      Reflect.getMetadata("design:paramtypes", target) || [];
    existingParams[parameterIndex] = token;
    Reflect.defineMetadata("design:paramtypes", existingParams, target);
  };
}
//# sourceMappingURL=container-decorator.js.map
