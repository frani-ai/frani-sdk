import "reflect-metadata";
import { JwtStrategy } from "../../../../src/modules/auth/strategies/jwt.strategy";
import {
  IAuthUser,
  IJwtConfig,
} from "../../../../src/modules/auth/interfaces/auth.interface";

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;
  const testConfig: IJwtConfig = {
    secret: "test-secret-key",
    expiresIn: "1h",
    algorithm: "HS256",
  };

  beforeEach(() => {
    jwtStrategy = new JwtStrategy(testConfig);
  });

  describe("constructor", () => {
    it("deve criar uma instância com configuração customizada", () => {
      expect(jwtStrategy).toBeDefined();
      expect(jwtStrategy.name).toBe("jwt");
    });

    it("deve usar configuração padrão quando não fornecida", () => {
      const defaultStrategy = new JwtStrategy();
      expect(defaultStrategy).toBeDefined();
      expect(defaultStrategy.name).toBe("jwt");
    });
  });

  describe("sign", () => {
    it("deve gerar um token JWT válido", () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        username: "testuser",
        roles: ["user"],
      };

      const token = jwtStrategy.sign(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT tem 3 partes
    });

    it("deve gerar tokens diferentes para usuários diferentes", () => {
      const user1: IAuthUser = { id: "1", email: "user1@example.com" };
      const user2: IAuthUser = { id: "2", email: "user2@example.com" };

      const token1 = jwtStrategy.sign(user1);
      const token2 = jwtStrategy.sign(user2);

      expect(token1).not.toBe(token2);
    });

    it("deve incluir dados do usuário no payload", () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        username: "testuser",
        roles: ["admin", "user"],
      };

      const token = jwtStrategy.sign(user);
      const decoded = jwtStrategy.decode(token);

      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe("123");
      expect(decoded?.email).toBe("test@example.com");
      expect(decoded?.username).toBe("testuser");
      expect(decoded?.roles).toEqual(["admin", "user"]);
    });
  });

  describe("validate", () => {
    it("deve validar um token válido", async () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const token = jwtStrategy.sign(user);
      const validatedUser = await jwtStrategy.validate({ token });

      expect(validatedUser).toBeDefined();
      expect(validatedUser?.id).toBe("123");
      expect(validatedUser?.email).toBe("test@example.com");
    });

    it("deve retornar null para token inválido", async () => {
      const invalidToken = "invalid.token.here";
      const result = await jwtStrategy.validate({ token: invalidToken });

      expect(result).toBeNull();
    });

    it("deve retornar null quando token não é fornecido", async () => {
      const result = await jwtStrategy.validate({ token: "" });

      expect(result).toBeNull();
    });

    it("deve retornar null para token expirado", async () => {
      const expiredStrategy = new JwtStrategy({
        secret: "test-secret",
        expiresIn: "0s", // Expira imediatamente
      });

      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = expiredStrategy.sign(user);

      // Aguardar um pouco para garantir expiração
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await expiredStrategy.validate({ token });

      expect(result).toBeNull();
    });

    it("deve validar token com secret correto", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      const result = await jwtStrategy.validate({ token });

      expect(result).not.toBeNull();
      expect(result?.id).toBe("123");
    });
  });

  describe("generateTokenPair", () => {
    it("deve gerar access token e refresh token", () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
      };

      const tokens = jwtStrategy.generateTokenPair(user);

      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe("string");
      expect(typeof tokens.refreshToken).toBe("string");
    });

    it("deve gerar tokens diferentes", () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const tokens = jwtStrategy.generateTokenPair(user);

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });

    it("refresh token deve conter tipo refresh", () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const tokens = jwtStrategy.generateTokenPair(user);
      const decoded = jwtStrategy.decode(tokens.refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded?.type).toBe("refresh");
    });
  });

  describe("decode", () => {
    it("deve decodificar um token sem validar", () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        username: "testuser",
      };

      const token = jwtStrategy.sign(user);
      const decoded = jwtStrategy.decode(token);

      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe("123");
      expect(decoded?.email).toBe("test@example.com");
    });

    it("deve retornar null para token inválido", () => {
      const result = jwtStrategy.decode("invalid.token");

      expect(result).toBeNull();
    });

    it("deve decodificar token expirado sem erro", () => {
      const expiredStrategy = new JwtStrategy({
        secret: "test-secret",
        expiresIn: "0s",
      });

      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = expiredStrategy.sign(user);
      const decoded = jwtStrategy.decode(token);

      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe("123");
    });
  });

  describe("isExpired", () => {
    it("deve retornar false para token válido", () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      const expired = jwtStrategy.isExpired(token);

      expect(expired).toBe(false);
    });

    it("deve retornar true para token expirado", async () => {
      const expiredStrategy = new JwtStrategy({
        secret: "test-secret",
        expiresIn: "1ms",
      });

      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = expiredStrategy.sign(user);

      // Aguardar expiração
      await new Promise((resolve) => setTimeout(resolve, 100));

      const expired = expiredStrategy.isExpired(token);

      expect(expired).toBe(true);
    });

    it("deve retornar true para token inválido", () => {
      const expired = jwtStrategy.isExpired("invalid.token");

      expect(expired).toBe(true);
    });

    it("deve retornar true para token sem exp", () => {
      const expired = jwtStrategy.isExpired("");

      expect(expired).toBe(true);
    });
  });

  describe("updateConfig", () => {
    it("deve atualizar a configuração", () => {
      const newConfig: Partial<IJwtConfig> = {
        expiresIn: "2h",
      };

      jwtStrategy.updateConfig(newConfig);

      // Gerar token com nova configuração
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);
      const decoded = jwtStrategy.decode(token);

      expect(decoded).toBeDefined();
      expect(decoded?.exp).toBeDefined();
    });

    it("deve mesclar com configuração existente", () => {
      const originalSecret = testConfig.secret;
      jwtStrategy.updateConfig({ expiresIn: "3h" });

      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      // Token ainda deve ser válido com secret original
      const result = jwtStrategy.decode(token);
      expect(result).toBeDefined();
    });
  });

  describe("Integração", () => {
    it("deve funcionar em fluxo completo de autenticação", async () => {
      // 1. Criar usuário
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        username: "testuser",
        roles: ["user", "admin"],
      };

      // 2. Gerar tokens
      const tokens = jwtStrategy.generateTokenPair(user);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      // 3. Validar access token
      const validatedUser = await jwtStrategy.validate({
        token: tokens.accessToken,
      });
      expect(validatedUser).toBeDefined();
      expect(validatedUser?.id).toBe("123");
      expect(validatedUser?.email).toBe("test@example.com");

      // 4. Verificar se não está expirado
      const expired = jwtStrategy.isExpired(tokens.accessToken);
      expect(expired).toBe(false);

      // 5. Decodificar para inspecionar
      const decoded = jwtStrategy.decode(tokens.accessToken);
      expect(decoded?.sub).toBe("123");
      expect(decoded?.roles).toEqual(["user", "admin"]);
    });

    it("deve rejeitar token com secret incorreto", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      // Criar nova estratégia com secret diferente
      const wrongStrategy = new JwtStrategy({
        secret: "wrong-secret",
        expiresIn: "1h",
      });

      const result = await wrongStrategy.validate({ token });

      expect(result).toBeNull();
    });
  });
});
