import "reflect-metadata";
import { HealthController } from "../../../src/modules/health/health.controller";
import { Logger } from "../../../src/modules/logger/logger.service";
import { BadGatewayException } from "../../../src/core/http";

describe("HealthController", () => {
  let healthController: HealthController;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    jest.spyOn(logger, "log").mockImplementation();
    healthController = new HealthController(logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("index", () => {
    it('deve retornar "ok"', () => {
      const result = healthController.index();

      expect(result).toBe("ok");
    });

    it('deve logar a mensagem "rota health"', () => {
      healthController.index();

      expect(logger.log).toHaveBeenCalledWith("rota health");
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  describe("error", () => {
    it("deve lançar BadGatewayException", () => {
      expect(() => healthController.error()).toThrow(BadGatewayException);
    });

    it('deve lançar exceção com mensagem "error 400"', () => {
      try {
        healthController.error();
        fail("Deveria ter lançado uma exceção");
      } catch (error) {
        expect(error).toBeInstanceOf(BadGatewayException);
        expect((error as BadGatewayException).message).toBe("error 400");
      }
    });

    it("deve lançar exceção com status code 502", () => {
      try {
        healthController.error();
        fail("Deveria ter lançado uma exceção");
      } catch (error) {
        expect((error as BadGatewayException).statusCode).toBe(502);
      }
    });
  });

  describe("Injeção de dependência", () => {
    it("deve receber Logger no construtor", () => {
      const controller = new HealthController(logger);

      expect(controller["logger"]).toBe(logger);
    });

    it("deve usar a instância do Logger injetada", () => {
      const mockLogger = new Logger();
      const logSpy = jest.spyOn(mockLogger, "log").mockImplementation();
      const controller = new HealthController(mockLogger);

      controller.index();

      expect(logSpy).toHaveBeenCalled();
    });
  });
});
