import "reflect-metadata";
import { Container } from "../../../src/core/di/container";
import { AuthService } from "../../../src/modules/auth/auth.service";
import { JwtStrategy } from "../../../src/modules/auth/strategies/jwt.strategy";
import { OAuthStrategy } from "../../../src/modules/auth/strategies/oauth.strategy";
import { OpenIDStrategy } from "../../../src/modules/auth/strategies/openid.strategy";
import { Logger } from "../../../src/modules/logger/logger.service";
import {
  UnauthorizedException,
  BadRequestException,
} from "../../../src/core/http";

describe("AuthService", () => {
  let authService: AuthService;
  let jwtStrategy: JwtStrategy;
  let oauthStrategy: OAuthStrategy;
  let openidStrategy: OpenIDStrategy;
  let logger: Logger;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy({
      secret: "test-secret",
      expiresIn: "1h",
    });
    oauthStrategy = new OAuthStrategy();
    openidStrategy = new OpenIDStrategy();
    logger = new Logger();

    (Container as any).instances.set(JwtStrategy, jwtStrategy);
    (Container as any).instances.set(OAuthStrategy, oauthStrategy);
    (Container as any).instances.set(OpenIDStrategy, openidStrategy);

    jest.spyOn(logger, "log").mockImplementation();
    jest.spyOn(logger, "error").mockImplementation();

    authService = new AuthService(logger);
  });

  afterEach(() => {
    (Container as any).instances.clear();
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("deve criar uma instância e registrar estratégias disponíveis no Container", () => {
      expect(authService).toBeDefined();
      expect(logger.log).toHaveBeenCalledWith(
        "Estratégia de autenticação registrada: jwt",
      );
      expect(logger.log).toHaveBeenCalledWith(
        "Estratégia de autenticação registrada: oauth",
      );
      expect(logger.log).toHaveBeenCalledWith(
        "Estratégia de autenticação registrada: openid",
      );
    });
  });

  describe("registerStrategy", () => {
    it("deve registrar uma nova estratégia", () => {
      const customStrategy = {
        name: "custom",
        validate: jest.fn(),
      };

      authService.registerStrategy(customStrategy as any);

      expect(logger.log).toHaveBeenCalledWith(
        "Estratégia de autenticação registrada: custom",
      );
      expect(authService.getStrategy("custom")).toBe(customStrategy);
    });
  });

  describe("getStrategy", () => {
    it("deve retornar estratégia JWT", () => {
      const strategy = authService.getStrategy("jwt");

      expect(strategy).toBe(jwtStrategy);
    });

    it("deve retornar estratégia OAuth", () => {
      const strategy = authService.getStrategy("oauth");

      expect(strategy).toBe(oauthStrategy);
    });

    it("deve retornar estratégia OpenID", () => {
      const strategy = authService.getStrategy("openid");

      expect(strategy).toBe(openidStrategy);
    });

    it("deve retornar undefined para estratégia não registrada", () => {
      const strategy = authService.getStrategy("nonexistent");

      expect(strategy).toBeUndefined();
    });
  });

  describe("generateTokenPair", () => {
    it("deve gerar accessToken e refreshToken para um usuário", () => {
      const user = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const result = authService.generateTokenPair(user);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.tokenType).toBe("Bearer");
    });

    it("deve lançar BadRequestException quando JWT não está habilitado", () => {
      (Container as any).instances.delete(JwtStrategy);
      const serviceWithoutJwt = new AuthService(logger);

      expect(() =>
        serviceWithoutJwt.generateTokenPair({
          id: "123",
          email: "test@example.com",
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        serviceWithoutJwt.generateTokenPair({
          id: "123",
          email: "test@example.com",
        }),
      ).toThrow("Estratégia JWT não está habilitada");
    });
  });

  describe("validateToken", () => {
    it("deve validar token válido", async () => {
      const user = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const token = jwtStrategy.sign(user);
      const result = await authService.validateToken(token);

      expect(result).toBeDefined();
      expect(result?.id).toBe("123");
      expect(result?.email).toBe("test@example.com");
    });

    it("deve retornar null para token inválido", async () => {
      const result = await authService.validateToken("invalid.token");

      expect(result).toBeNull();
    });
  });

  describe("refreshAccessToken", () => {
    it("deve gerar novo access token com refresh token válido", async () => {
      const user = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const tokens = jwtStrategy.generateTokenPair(user);
      const result = await authService.refreshAccessToken(tokens.refreshToken);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.tokenType).toBe("Bearer");
      expect(logger.log).toHaveBeenCalledWith("Token atualizado com sucesso", {
        userId: "123",
      });
    });

    it("deve lançar UnauthorizedException para refresh token inválido", async () => {
      await expect(
        authService.refreshAccessToken("invalid.token"),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        authService.refreshAccessToken("invalid.token"),
      ).rejects.toThrow("Refresh token inválido");
    });

    it("deve logar erro quando refresh falha", async () => {
      try {
        await authService.refreshAccessToken("invalid.token");
      } catch (error) {
        expect(logger.error).toHaveBeenCalledWith(
          "Falha ao atualizar token",
          expect.any(Object),
        );
      }
    });
  });

  describe("hashPassword", () => {
    it("deve gerar hash de senha", async () => {
      const password = "password123";
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("deve gerar hashes diferentes para mesma senha", async () => {
      const password = "password123";
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it("deve aceitar número de rounds customizado", async () => {
      const password = "password123";
      const hash = await authService.hashPassword(password, 5);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });
  });

  describe("comparePassword", () => {
    it("deve retornar true para senha correta", async () => {
      const password = "password123";
      const hash = await authService.hashPassword(password);

      const result = await authService.comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it("deve retornar false para senha incorreta", async () => {
      const password = "password123";
      const hash = await authService.hashPassword(password);

      const result = await authService.comparePassword("wrongpassword", hash);

      expect(result).toBe(false);
    });

    it("deve ser case-sensitive", async () => {
      const password = "Password123";
      const hash = await authService.hashPassword(password);

      const result = await authService.comparePassword("password123", hash);

      expect(result).toBe(false);
    });
  });

  describe("getOAuthAuthorizationUrl", () => {
    it("deve retornar URL de autorização OAuth", () => {
      const url = authService.getOAuthAuthorizationUrl("random-state");

      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
      expect(url).toContain("state=random-state");
    });

    it("deve funcionar sem state", () => {
      const url = authService.getOAuthAuthorizationUrl();

      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
    });
  });

  describe("getOpenIDAuthorizationUrl", () => {
    it("deve retornar URL de autorização OpenID", () => {
      const url = authService.getOpenIDAuthorizationUrl("state", "nonce");

      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
      expect(url).toContain("state=state");
      expect(url).toContain("nonce=nonce");
    });

    it("deve funcionar sem state e nonce", () => {
      const url = authService.getOpenIDAuthorizationUrl();

      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
    });
  });

  describe("isTokenExpired", () => {
    it("deve retornar false para token válido", () => {
      const user = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      const expired = authService.isTokenExpired(token);

      expect(expired).toBe(false);
    });

    it("deve retornar true para token expirado", async () => {
      const expiredStrategy = new JwtStrategy({
        secret: "test-secret",
        expiresIn: "1ms",
      });
      (Container as any).instances.set(JwtStrategy, expiredStrategy);
      const expiredService = new AuthService(logger);

      const user = { id: "123", email: "test@example.com" };
      const token = expiredStrategy.sign(user);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const expired = expiredService.isTokenExpired(token);

      expect(expired).toBe(true);
    });
  });

  describe("Integração", () => {
    it("deve funcionar em fluxo completo: generateTokenPair -> validate -> refresh", async () => {
      const user = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const loginResult = authService.generateTokenPair(user);

      expect(loginResult.accessToken).toBeDefined();
      expect(loginResult.refreshToken).toBeDefined();

      const validatedUser = await authService.validateToken(
        loginResult.accessToken,
      );
      expect(validatedUser?.id).toBe("123");

      const refreshResult = await authService.refreshAccessToken(
        loginResult.refreshToken!,
      );
      expect(refreshResult.accessToken).toBeDefined();

      const revalidatedUser = await authService.validateToken(
        refreshResult.accessToken,
      );
      expect(revalidatedUser?.id).toBe("123");
    });
  });
});
