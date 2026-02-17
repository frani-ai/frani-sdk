import { IInterceptor } from "../src/core/http/interfaces/interceptor.interface";
import { HttpContext } from "../src/core/http/interfaces/exception-filter.interface";

/**
 * Example of a Logging Interceptor
 * This interceptor logs all incoming requests
 */
export class LoggingInterceptor implements IInterceptor {
  async intercept(context: HttpContext): Promise<boolean> {
    const { request } = context;

    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = request.url;
    const ip = request.socket.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Always allow the request to continue
    return true;
  }
}
