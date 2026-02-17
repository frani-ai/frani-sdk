import { IInterceptor } from "../src/core/http/interfaces/interceptor.interface";
import { HttpContext } from "../src/core/http/interfaces/exception-filter.interface";

/**
 * Example of an Authentication Interceptor
 * This interceptor checks if the request has a valid authorization token
 */
export class AuthInterceptor implements IInterceptor {
  async intercept(context: HttpContext): Promise<boolean> {
    const { request, response } = context;

    // Get the authorization header
    const authHeader = request.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or invalid authorization header");

      if (!response.writableEnded) {
        response.writeHead(401, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            statusCode: 401,
            error: "Unauthorized",
            message: "Missing or invalid authorization token",
          }),
        );
      }

      return false; // Block the request
    }

    // Extract the token
    const token = authHeader.substring(7);

    // Validate the token (example validation)
    if (token !== "valid-token-123") {
      console.log("❌ Invalid token");

      if (!response.writableEnded) {
        response.writeHead(401, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            statusCode: 401,
            error: "Unauthorized",
            message: "Invalid token",
          }),
        );
      }

      return false; // Block the request
    }

    console.log("✅ Token validated successfully");
    return true; // Allow the request to continue
  }
}
