"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.DependencyContainer = void 0;
class DependencyContainer {
  constructor() {
    this.instances = new Map();
  }
  register(token, instance) {
    this.instances.set(token, instance);
  }
  resolve(token) {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }
    const paramTypes = Reflect.getMetadata("design:paramtypes", token) || [];
    const dependencies = paramTypes.map((dep) => this.resolve(dep));
    const instance = new token(...dependencies);
    this.register(token, instance);
    return instance;
  }
}
exports.DependencyContainer = DependencyContainer;
exports.Container = new DependencyContainer();
//# sourceMappingURL=container.js.map
