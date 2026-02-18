import { HttpStatusCode } from "./enums/htt-status.enum";
export declare function Controller(basePath?: string): (target: any) => void;
export declare const Get: (
  path: string,
) => (target: unknown, propertyKey: string) => void;
export declare const Post: (
  path: string,
) => (target: unknown, propertyKey: string) => void;
export declare const Put: (
  path: string,
) => (target: unknown, propertyKey: string) => void;
export declare const Delete: (
  path: string,
) => (target: unknown, propertyKey: string) => void;
/**
 * Decorator to mark a class as an Exception Filter
 * The class must implement IExceptionFilter interface
 */
export declare function Catch(): (target: any) => void;
/**
 * Decorator to define the HTTP response status code for a route handler
 * @param statusCode - The HTTP status code to return
 */
export declare function HttpStatus(
  statusCode: HttpStatusCode,
): (target: any, propertyKey: string) => void;
/**
 * Decorator to apply an interceptor to a route handler
 * @param interceptorClass - The interceptor class that implements IInterceptor
 */
export declare function Interceptor(
  interceptorClass: any,
): (target: any, propertyKey: string) => void;
//# sourceMappingURL=http-decorator.d.ts.map
