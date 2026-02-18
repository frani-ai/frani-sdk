import "reflect-metadata";
import "dotenv/config";
import { IInterceptor } from "./interfaces/interceptor.interface";
import { IExceptionFilter } from "./interfaces/exception-filter.interface";
export declare class HttpServer {
  private port;
  private router;
  private globalInterceptor?;
  private globalExceptionFilter?;
  constructor(port?: number);
  /**
   * Set a global interceptor that will be applied to all routes
   * @param interceptorClass - The interceptor class that implements IInterceptor
   */
  setGlobalInterceptor(interceptorClass: new () => IInterceptor): void;
  /**
   * Set a global exception filter that will handle all uncaught exceptions
   * @param filterClass - The filter class that implements IExceptionFilter
   */
  setGlobalExceptionFilter(filterClass: new () => IExceptionFilter): void;
  registerController(controllerInstance: Function): void;
  listen(): Promise<void>;
  registerModule(moduleClass: any): void;
}
//# sourceMappingURL=http-server.d.ts.map
