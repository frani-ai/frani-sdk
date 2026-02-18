export declare class DependencyContainer {
  private instances;
  register(token: any, instance: any): void;
  resolve<T>(token: new (...args: any[]) => T): T;
}
export declare const Container: DependencyContainer;
//# sourceMappingURL=container.d.ts.map
