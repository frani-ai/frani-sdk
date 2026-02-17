import { Catch } from "../core/http/http-decorator";
import {
  IExceptionFilter,
  HttpContext,
} from "../core/http/interfaces/exception-filter.interface";
import {
  HttpException,
  BadRequestException,
} from "../core/http/exceptions/http-exception";

/**
 * Example of a Validation Exception Filter
 * This filter provides detailed validation error messages
 */
@Catch()
export class ValidationExceptionFilter implements IExceptionFilter {
  async catch(exception: HttpException, context: HttpContext): Promise<void> {
    const { response } = context;

    // Special handling for validation errors (BadRequestException)
    if (exception instanceof BadRequestException) {
      const errorResponse = {
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        error: "Validation Error",
        message: exception.message,
        details: this.parseValidationMessage(exception.message),
      };

      console.error(`[Validation Error] ${exception.message}`);

      if (!response.writableEnded) {
        response.writeHead(exception.statusCode, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify(errorResponse));
      }
      return;
    }

    // Default handling for other exceptions
    const errorResponse = {
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
      error: exception.error || exception.name,
      message: exception.message,
    };

    console.error(`[${exception.statusCode}] ${exception.message}`);

    if (!response.writableEnded) {
      response.writeHead(exception.statusCode, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(errorResponse));
    }
  }

  private parseValidationMessage(message: string): string[] {
    // Example: parse comma-separated validation errors
    return message.split(",").map((m) => m.trim());
  }
}
