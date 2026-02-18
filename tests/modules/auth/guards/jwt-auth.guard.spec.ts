import "reflect-metadata";
import { JwtAuthGuard } from "../../../../src/modules/auth/guards/jwt-auth.guard";
import { JwtStrategy } from "../../../../src/modules/auth/strategies/jwt.strategy";
import { UnauthorizedException } from "../../../../src/core/http";
import { IAuthUser } from "../../../../src/modules/auth/interfaces/auth.interface";

describe("JwtAuthGuard", () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy({
      secret: "test-secret",
      expiresIn: "1h",
    });
    jwtAuthGuard = new JwtAuthGuard(jwtStrategy);
  });

  describe("canActivate", () => {
    it("deve retornar true para token válido", async () => {
      const user: IAuthUser = {
        id: "123",
        email: "test@example.com",
        roles: ["user"],
      };

      const token = jwtStrategy.sign(user);

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      const result = await jwtAuthGuard.canActivate(context);

      expect(result).toBe(true);
      expect(context.user).toBeDefined();
      expect(context.user.id).toBe("123");
      expect(context.user.email).toBe("test@example.com");
    });

    it("deve lançar UnauthorizedException quando token não é fornecido", async () => {
      const context: any = {
        request: {
          headers: {},
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        "Token não fornecido",
      );
    });

    it("deve lançar UnauthorizedException quando header authorization não existe", async () => {
      const context: any = {
        request: {
          headers: {},
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve lançar UnauthorizedException para token inválido", async () => {
      const context: any = {
        request: {
          headers: {
            authorization: "Bearer invalid.token.here",
          },
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        "Token inválido",
      );
    });

    it("deve lançar UnauthorizedException quando formato do header é inválido", async () => {
      const context: any = {
        request: {
          headers: {
            authorization: "InvalidFormat token",
          },
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve lançar UnauthorizedException quando token está vazio", async () => {
      const context: any = {
        request: {
          headers: {
            authorization: "Bearer ",
          },
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve adicionar usuário ao contexto quando autenticado", async () => {
      const user: IAuthUser = {
        id: "456",
        email: "user@example.com",
        username: "testuser",
        roles: ["admin", "user"],
      };

      const token = jwtStrategy.sign(user);

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      await jwtAuthGuard.canActivate(context);

      expect(context.user).toBeDefined();
      expect(context.user.id).toBe("456");
      expect(context.user.email).toBe("user@example.com");
      expect(context.user.username).toBe("testuser");
      expect(context.user.roles).toEqual(["admin", "user"]);
    });

    it("deve aceitar Bearer com letra maiúscula", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      const result = await jwtAuthGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it("deve rejeitar quando tipo não é Bearer", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      const context: any = {
        request: {
          headers: {
            authorization: `Basic ${token}`,
          },
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve lançar UnauthorizedException genérica para erros inesperados", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      // Simular erro no jwtStrategy
      jest
        .spyOn(jwtStrategy, "validate")
        .mockRejectedValue(new Error("Unexpected error"));

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
        "Falha na autenticação",
      );
    });
  });

  describe("Integração", () => {
    it("deve funcionar em fluxo completo de autenticação", async () => {
      // 1. Criar usuário e gerar token
      const user: IAuthUser = {
        id: "789",
        email: "integration@example.com",
        username: "integrationuser",
        roles: ["user"],
      };

      const token = jwtStrategy.sign(user);

      // 2. Simular requisição HTTP
      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      // 3. Validar com guard
      const canActivate = await jwtAuthGuard.canActivate(context);

      // 4. Verificar resultado
      expect(canActivate).toBe(true);
      expect(context.user).toBeDefined();
      expect(context.user.id).toBe("789");
      expect(context.user.email).toBe("integration@example.com");
      expect(context.user.username).toBe("integrationuser");
      expect(context.user.roles).toEqual(["user"]);
    });

    it("deve rejeitar token expirado", async () => {
      const expiredStrategy = new JwtStrategy({
        secret: "test-secret",
        expiresIn: "0s",
      });

      const expiredGuard = new JwtAuthGuard(expiredStrategy);

      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = expiredStrategy.sign(user);

      // Aguardar expiração
      await new Promise((resolve) => setTimeout(resolve, 100));

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      await expect(expiredGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("deve rejeitar token com secret incorreto", async () => {
      const user: IAuthUser = { id: "123", email: "test@example.com" };
      const token = jwtStrategy.sign(user);

      // Criar guard com secret diferente
      const wrongStrategy = new JwtStrategy({
        secret: "wrong-secret",
        expiresIn: "1h",
      });
      const wrongGuard = new JwtAuthGuard(wrongStrategy);

      const context: any = {
        request: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      };

      await expect(wrongGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
