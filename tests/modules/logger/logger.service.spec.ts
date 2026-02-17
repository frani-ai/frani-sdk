import "reflect-metadata";
import { Logger } from "../../../src/modules/logger/logger.service";

describe("Logger", () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("log", () => {
    it("deve logar uma mensagem simples", () => {
      logger.log("Test message");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleLogSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("log");
      expect(loggedData.message).toBe("Test message");
      expect(loggedData.dateTime).toBeDefined();
      expect(loggedData.environment).toBe(process.env.NODE_ENV);
    });

    it("deve logar uma mensagem com contexto", () => {
      const context = { userId: "123", action: "login" };
      logger.log("User logged in", context);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleLogSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("log");
      expect(loggedData.message).toBe("User logged in");
      expect(loggedData.context).toEqual(context);
    });

    it("deve logar um objeto como mensagem", () => {
      const message = { status: "success", code: 200 };
      logger.log(message);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleLogSpy.mock.calls[0][0];
      expect(loggedData.message).toEqual(message);
    });
  });

  describe("warn", () => {
    it("deve logar um warning", () => {
      logger.warn("Warning message");

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleWarnSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("warn");
      expect(loggedData.message).toBe("Warning message");
    });

    it("deve logar um warning com contexto", () => {
      const context = { resource: "database", issue: "slow query" };
      logger.warn("Performance issue detected", context);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleWarnSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("warn");
      expect(loggedData.message).toBe("Performance issue detected");
      expect(loggedData.context).toEqual(context);
    });
  });

  describe("debug", () => {
    it("deve logar uma mensagem de debug", () => {
      logger.debug("Debug message");

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleDebugSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("debug");
      expect(loggedData.message).toBe("Debug message");
    });

    it("deve logar debug com contexto", () => {
      const context = { step: 1, data: "processing" };
      logger.debug("Processing step", context);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleDebugSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("debug");
      expect(loggedData.context).toEqual(context);
    });
  });

  describe("error", () => {
    it("deve logar um erro", () => {
      logger.error("Error message");

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("error");
      expect(loggedData.message).toBe("Error message");
    });

    it("deve logar um erro com contexto", () => {
      const context = { errorCode: "ERR_001", stack: "stack trace" };
      logger.error("Critical error occurred", context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][0];
      expect(loggedData.level).toBe("error");
      expect(loggedData.message).toBe("Critical error occurred");
      expect(loggedData.context).toEqual(context);
    });

    it("deve logar um objeto de erro", () => {
      const error = { name: "DatabaseError", message: "Connection failed" };
      logger.error(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedData = consoleErrorSpy.mock.calls[0][0];
      expect(loggedData.message).toEqual(error);
    });
  });

  describe("formato de log", () => {
    it("deve incluir timestamp ISO no log", () => {
      const beforeLog = new Date().toISOString();
      logger.log("Test");
      const afterLog = new Date().toISOString();

      const loggedData = consoleLogSpy.mock.calls[0][0];
      expect(loggedData.dateTime).toBeDefined();
      expect(loggedData.dateTime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(loggedData.dateTime >= beforeLog).toBe(true);
      expect(loggedData.dateTime <= afterLog).toBe(true);
    });

    it("deve incluir o ambiente no log", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "test";

      logger.log("Test");

      const loggedData = consoleLogSpy.mock.calls[0][0];
      expect(loggedData.environment).toBe("test");

      process.env.NODE_ENV = originalEnv;
    });

    it("deve ter estrutura consistente em todos os níveis", () => {
      logger.log("log message");
      logger.warn("warn message");
      logger.debug("debug message");
      logger.error("error message");

      const logData = consoleLogSpy.mock.calls[0][0];
      const warnData = consoleWarnSpy.mock.calls[0][0];
      const debugData = consoleDebugSpy.mock.calls[0][0];
      const errorData = consoleErrorSpy.mock.calls[0][0];

      [logData, warnData, debugData, errorData].forEach((data) => {
        expect(data).toHaveProperty("dateTime");
        expect(data).toHaveProperty("level");
        expect(data).toHaveProperty("message");
        expect(data).toHaveProperty("environment");
      });
    });
  });
});
