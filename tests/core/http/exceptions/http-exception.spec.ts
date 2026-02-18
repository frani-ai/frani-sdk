import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  BadGatewayException,
  ServiceUnavailableException,
  ConflictException,
  TooManyRequestsException,
} from "../../../../src/core/http/exceptions/http-exception";

describe("HttpException", () => {
  describe("HttpException base class", () => {
    it("deve criar uma exceção com mensagem e status code", () => {
      const exception = new HttpException("Test error", 418);

      expect(exception.message).toBe("Test error");
      expect(exception.statusCode).toBe(418);
      expect(exception.name).toBe("HttpException");
    });

    it("deve criar uma exceção com erro customizado", () => {
      const exception = new HttpException("Test error", 418, "CustomError");

      expect(exception.error).toBe("CustomError");
    });

    it("deve ter stack trace", () => {
      const exception = new HttpException("Test error", 500);

      expect(exception.stack).toBeDefined();
    });

    it("deve serializar para JSON corretamente", () => {
      const beforeTime = new Date().toISOString();
      const exception = new HttpException("Test error", 418, "TeapotError");
      const afterTime = new Date().toISOString();
      const json = exception.toJSON();

      expect(json.statusCode).toBe(418);
      expect(json.error).toBe("TeapotError");
      expect(json.message).toBe("Test error");
      expect(json.dateTime).toBeDefined();
      expect(json.dateTime >= beforeTime).toBe(true);
      expect(json.dateTime <= afterTime).toBe(true);
    });

    it("deve usar o nome da classe como erro padrão no JSON", () => {
      const exception = new HttpException("Test error", 500);
      const json = exception.toJSON();

      expect(json.error).toBe("HttpException");
    });
  });

  describe("4xx Client Errors", () => {
    it("BadRequestException deve ter status 400", () => {
      const exception = new BadRequestException();

      expect(exception.statusCode).toBe(400);
      expect(exception.message).toBe("Bad Request");
      expect(exception.error).toBe("Bad Request");
    });

    it("BadRequestException deve aceitar mensagem customizada", () => {
      const exception = new BadRequestException("Invalid input");

      expect(exception.message).toBe("Invalid input");
      expect(exception.statusCode).toBe(400);
    });

    it("UnauthorizedException deve ter status 401", () => {
      const exception = new UnauthorizedException();

      expect(exception.statusCode).toBe(401);
      expect(exception.message).toBe("Unauthorized");
    });

    it("UnauthorizedException deve aceitar mensagem customizada", () => {
      const exception = new UnauthorizedException("Token expired");

      expect(exception.message).toBe("Token expired");
    });

    it("ForbiddenException deve ter status 403", () => {
      const exception = new ForbiddenException();

      expect(exception.statusCode).toBe(403);
      expect(exception.message).toBe("Forbidden");
    });

    it("NotFoundException deve ter status 404", () => {
      const exception = new NotFoundException();

      expect(exception.statusCode).toBe(404);
      expect(exception.message).toBe("Not Found");
    });

    it("NotFoundException deve aceitar mensagem customizada", () => {
      const exception = new NotFoundException("User not found");

      expect(exception.message).toBe("User not found");
    });

    it("ConflictException deve ter status 409", () => {
      const exception = new ConflictException();

      expect(exception.statusCode).toBe(409);
      expect(exception.message).toBe("Conflict");
    });

    it("ConflictException deve aceitar mensagem customizada", () => {
      const exception = new ConflictException("Email already exists");

      expect(exception.message).toBe("Email already exists");
    });

    it("TooManyRequestsException deve ter status 429", () => {
      const exception = new TooManyRequestsException();

      expect(exception.statusCode).toBe(429);
      expect(exception.message).toBe("Too Many Requests");
    });
  });

  describe("5xx Server Errors", () => {
    it("InternalServerErrorException deve ter status 500", () => {
      const exception = new InternalServerErrorException();

      expect(exception.statusCode).toBe(500);
      expect(exception.message).toBe("Internal Server Error");
      expect(exception.error).toBe("Internal Server Error");
    });

    it("InternalServerErrorException deve aceitar mensagem customizada", () => {
      const exception = new InternalServerErrorException(
        "Database connection failed",
      );

      expect(exception.message).toBe("Database connection failed");
      expect(exception.statusCode).toBe(500);
    });

    it("BadGatewayException deve ter status 502", () => {
      const exception = new BadGatewayException();

      expect(exception.statusCode).toBe(502);
      expect(exception.message).toBe("Bad Gateway");
    });

    it("BadGatewayException deve aceitar mensagem customizada", () => {
      const exception = new BadGatewayException("Upstream service error");

      expect(exception.message).toBe("Upstream service error");
    });

    it("ServiceUnavailableException deve ter status 503", () => {
      const exception = new ServiceUnavailableException();

      expect(exception.statusCode).toBe(503);
      expect(exception.message).toBe("Service Unavailable");
    });
  });

  describe("Herança e instanceof", () => {
    it("todas as exceções devem ser instâncias de HttpException", () => {
      const exceptions = [
        new BadRequestException(),
        new UnauthorizedException(),
        new ForbiddenException(),
        new NotFoundException(),
        new InternalServerErrorException(),
        new BadGatewayException(),
      ];

      exceptions.forEach((exception) => {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception).toBeInstanceOf(Error);
      });
    });

    it("deve manter o nome correto da classe", () => {
      expect(new BadRequestException().name).toBe("BadRequestException");
      expect(new UnauthorizedException().name).toBe("UnauthorizedException");
      expect(new NotFoundException().name).toBe("NotFoundException");
      expect(new InternalServerErrorException().name).toBe(
        "InternalServerErrorException",
      );
    });
  });

  describe("toJSON", () => {
    it("deve serializar exceções client error corretamente", () => {
      const exception = new BadRequestException("Invalid data");
      const json = exception.toJSON();

      expect(json).toHaveProperty("statusCode", 400);
      expect(json).toHaveProperty("error", "Bad Request");
      expect(json).toHaveProperty("message", "Invalid data");
      expect(json).toHaveProperty("dateTime");
    });

    it("deve serializar exceções server error corretamente", () => {
      const exception = new InternalServerErrorException("Server crashed");
      const json = exception.toJSON();

      expect(json).toHaveProperty("statusCode", 500);
      expect(json).toHaveProperty("error", "Internal Server Error");
      expect(json).toHaveProperty("message", "Server crashed");
      expect(json).toHaveProperty("dateTime");
    });
  });
});
