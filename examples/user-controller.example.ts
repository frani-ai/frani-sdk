import {
  Controller,
  Get,
  Post,
  Interceptor,
} from "../src/core/http/http-decorator";
import { HttpContext } from "../src/core/http/interfaces/exception-filter.interface";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../src/core/http/exceptions/http-exception";
import { AuthInterceptor } from "./auth-interceptor.example";
import { LoggingInterceptor } from "./logging-interceptor.example";

/**
 * Example User Controller demonstrating:
 * - HTTP Exception handling
 * - Route-specific interceptors
 */
@Controller("/users")
export class UserController {
  private users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  /**
   * Public endpoint - no authentication required
   */
  @Get("/")
  @Interceptor(LoggingInterceptor)
  async listUsers(context: HttpContext) {
    return {
      success: true,
      data: this.users,
    };
  }

  /**
   * Protected endpoint - requires authentication
   */
  @Get("/:id")
  @Interceptor(AuthInterceptor)
  async getUserById(context: HttpContext) {
    const { request } = context;
    const url = request.url || "";
    const id = parseInt(url.split("/").pop() || "0");

    if (isNaN(id) || id <= 0) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = this.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Protected endpoint - create new user
   */
  @Post("/")
  @Interceptor(AuthInterceptor)
  async createUser(context: HttpContext) {
    const { body } = context;

    if (!body.name || !body.email) {
      throw new BadRequestException("Name and email are required");
    }

    const newUser = {
      id: this.users.length + 1,
      name: body.name,
      email: body.email,
    };

    this.users.push(newUser);

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  }

  /**
   * Example endpoint that throws an error
   */
  @Get("/error")
  async throwError(context: HttpContext) {
    throw new UnauthorizedException("This is a test exception");
  }
}
