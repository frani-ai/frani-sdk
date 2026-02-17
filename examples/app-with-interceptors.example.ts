import "reflect-metadata";
import { HttpServer } from "../src/core/http/http-server";
import { Module } from "../src/core/di/container-decorator";
import { GlobalExceptionFilter } from "./global-exception-filter.example";
import { LoggingInterceptor } from "./logging-interceptor.example";
import { UserController } from "./user-controller.example";

/**
 * Example Module with the UserController
 */
@Module({
  controllers: [UserController],
  providers: [],
})
export class ExampleModule {}

/**
 * Example application demonstrating:
 * - Global Exception Filter configuration
 * - Global Interceptor configuration
 * - Module registration with controllers
 *
 * Usage:
 * 1. Start the server: node dist/examples/app-with-interceptors.example.js
 *
 * 2. Test the endpoints:
 *    - GET http://localhost:3000/users (public, logged)
 *    - GET http://localhost:3000/users/1 (requires auth header: Authorization: Bearer valid-token-123)
 *    - POST http://localhost:3000/users (requires auth, body: { "name": "...", "email": "..." })
 *    - GET http://localhost:3000/users/error (throws exception, handled by global filter)
 */
async function bootstrap() {
  const app = new HttpServer(3000);

  // Configure global exception filter
  app.setGlobalExceptionFilter(GlobalExceptionFilter);
  console.log("✅ Global Exception Filter configured");

  // Configure global interceptor (will be applied to all routes)
  app.setGlobalInterceptor(LoggingInterceptor);
  console.log("✅ Global Interceptor configured");

  // Register the module
  app.registerModule(ExampleModule);

  // Start the server
  app.listen();
}

// Uncomment to run this example
// bootstrap();
