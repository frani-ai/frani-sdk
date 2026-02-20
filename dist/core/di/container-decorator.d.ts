import "reflect-metadata";
export declare function Module(metadata?: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}): (target: any) => void;
export declare function Injectable(): (target: any) => void;
export declare function Inject(
  token: any,
): (
  target: any,
  _propertyKey: string | undefined,
  parameterIndex: number,
) => void;
//# sourceMappingURL=container-decorator.d.ts.map
