import { HttpContext } from "./exception-filter.interface";

export interface IInterceptor {
  /**
   * Method called before the route handler is executed
   * @param context - The HTTP context containing request, response, and body
   * @returns boolean - Return true to continue execution, false to stop
   */
  intercept(context: HttpContext): boolean | Promise<boolean>;
}
