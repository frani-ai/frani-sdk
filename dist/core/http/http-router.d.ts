import { IncomingMessage, ServerResponse } from "http";
import { IInterceptor } from "./interfaces/interceptor.interface";
import { IExceptionFilter } from "./interfaces/exception-filter.interface";
export declare class Router {
  private routes;
  private globalInterceptor?;
  private globalExceptionFilter?;
  setGlobalInterceptor(interceptor: IInterceptor): void;
  setGlobalExceptionFilter(filter: IExceptionFilter): void;
  registerController(controllerInstance: any): void;
  handle(
    request: IncomingMessage & {
      url: string;
    },
    response: ServerResponse,
  ): Promise<boolean>;
  private handleException;
}
//# sourceMappingURL=http-router.d.ts.map
