import { IncomingMessage, ServerResponse } from "http";
import { HttpException } from "../exceptions/http-exception";

export interface HttpContext {
  request: IncomingMessage;
  response: ServerResponse;
  body?: any;
}

export interface IExceptionFilter {
  /**
   * Method called when an exception is caught
   * @param exception - The exception that was thrown
   * @param context - The HTTP context containing request and response
   */
  catch(exception: HttpException, context: HttpContext): void | Promise<void>;
}
