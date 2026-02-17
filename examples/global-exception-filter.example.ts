import { Catch } from "../src/core/http/http-decorator";
import {
  IExceptionFilter,
  HttpContext,
} from "../src/core/http/interfaces/exception-filter.interface";
import { HttpException } from "../src/core/http/exceptions/http-exception";

/**
 * Example of a Global Exception Filter
 * This class will catch all exceptions thrown in the application
 */
@Catch()
export class GlobalExceptionFilter implements IExceptionFilter {
  async catch(exception: HttpException, context: HttpContext): Promise<void> {
    const { response } = context;

    // Log the exception
    console.error(`[Exception] ${exception.statusCode} - ${exception.message}`);
    console.error(exception.stack);

    // Customize the error response
    const errorResponse = {
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
      error: exception.error || exception.name,
      message: exception.message,
    };

    // Send the response
    if (!response.writableEnded) {
      response.writeHead(exception.statusCode, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(errorResponse));
    }
  }
}
