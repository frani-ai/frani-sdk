export class DependencyContainer {
  private instances = new Map();

  register(token: any, instance: any) {
    this.instances.set(token, instance);
  }

  resolve<T>(token: new (...args: any[]) => T): T {
    if (this.instances.has(token)) {
      return this.instances.get(token)
    }

    const paramTypes = Reflect.getMetadata('design:paramtypes', token) || [];
    const dependencies = paramTypes.map((dep: any) => this.resolve(dep));
    const instance = new token(...dependencies);
    this.register(token, instance);
    return instance;
  }
}

export const Container = new DependencyContainer();