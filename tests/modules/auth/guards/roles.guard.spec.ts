import "reflect-metadata";
import { RolesGuard } from "../../../../src/modules/auth/guards/roles.guard";
import {
  UnauthorizedException,
  ForbiddenException,
} from "../../../../src/core/http";

describe("RolesGuard", () => {
  let rolesGuard: RolesGuard;

  beforeEach(() => {
    rolesGuard = new RolesGuard();
  });

  describe("setRequiredRoles", () => {
    it("deve definir roles necessárias", () => {
      rolesGuard.setRequiredRoles(["admin", "moderator"]);

      expect(rolesGuard["requiredRoles"]).toEqual(["admin", "moderator"]);
    });

    it("deve sobrescrever roles anteriores", () => {
      rolesGuard.setRequiredRoles(["user"]);
      rolesGuard.setRequiredRoles(["admin"]);

      expect(rolesGuard["requiredRoles"]).toEqual(["admin"]);
    });

    it("deve aceitar array vazio", () => {
      rolesGuard.setRequiredRoles([]);

      expect(rolesGuard["requiredRoles"]).toEqual([]);
    });
  });

  describe("canActivate", () => {
    it("deve retornar true quando usuário tem a role necessária", async () => {
      rolesGuard.setRequiredRoles(["admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "admin@example.com",
          roles: ["admin", "user"],
        },
      };

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it("deve retornar true quando usuário tem uma das roles necessárias", async () => {
      rolesGuard.setRequiredRoles(["admin", "moderator"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: ["moderator", "user"],
        },
      };

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it("deve lançar ForbiddenException quando usuário não tem a role necessária", async () => {
      rolesGuard.setRequiredRoles(["admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: ["user"],
        },
      };

      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        "Usuário não possui permissão para acessar este recurso",
      );
    });

    it("deve lançar UnauthorizedException quando usuário não está no contexto", async () => {
      rolesGuard.setRequiredRoles(["admin"]);

      const context: any = {};

      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        "Usuário não autenticado",
      );
    });

    it("deve retornar true quando nenhuma role é necessária", async () => {
      rolesGuard.setRequiredRoles([]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: ["user"],
        },
      };

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it("deve lançar ForbiddenException quando usuário não tem roles", async () => {
      rolesGuard.setRequiredRoles(["admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: [],
        },
      };

      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("deve lançar ForbiddenException quando usuário não tem propriedade roles", async () => {
      rolesGuard.setRequiredRoles(["admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
        },
      };

      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("deve ser case-sensitive na comparação de roles", async () => {
      rolesGuard.setRequiredRoles(["Admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: ["admin"],
        },
      };

      await expect(rolesGuard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("deve aceitar múltiplas roles e verificar qualquer uma", async () => {
      rolesGuard.setRequiredRoles(["admin", "moderator", "editor"]);

      const context: any = {
        user: {
          id: "123",
          email: "user@example.com",
          roles: ["editor", "user"],
        },
      };

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  describe("forRoles (static factory)", () => {
    it("deve criar uma nova instância com roles definidas", () => {
      const guard = RolesGuard.forRoles(["admin", "moderator"]);

      expect(guard).toBeInstanceOf(RolesGuard);
      expect(guard["requiredRoles"]).toEqual(["admin", "moderator"]);
    });

    it("deve criar instâncias independentes", () => {
      const guard1 = RolesGuard.forRoles(["admin"]);
      const guard2 = RolesGuard.forRoles(["user"]);

      expect(guard1["requiredRoles"]).toEqual(["admin"]);
      expect(guard2["requiredRoles"]).toEqual(["user"]);
    });

    it("deve funcionar com canActivate", async () => {
      const adminGuard = RolesGuard.forRoles(["admin"]);

      const context: any = {
        user: {
          id: "123",
          email: "admin@example.com",
          roles: ["admin"],
        },
      };

      const result = await adminGuard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  describe("Integração", () => {
    it("deve funcionar em fluxo completo de autorização", async () => {
      // 1. Criar guard para admin
      const adminGuard = RolesGuard.forRoles(["admin"]);

      // 2. Simular usuário admin autenticado
      const adminContext: any = {
        user: {
          id: "1",
          email: "admin@example.com",
          roles: ["admin", "user"],
        },
      };

      // 3. Verificar acesso
      const adminAccess = await adminGuard.canActivate(adminContext);
      expect(adminAccess).toBe(true);

      // 4. Simular usuário comum
      const userContext: any = {
        user: {
          id: "2",
          email: "user@example.com",
          roles: ["user"],
        },
      };

      // 5. Verificar que usuário comum não tem acesso
      await expect(adminGuard.canActivate(userContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("deve permitir acesso hierárquico de roles", async () => {
      const moderatorGuard = RolesGuard.forRoles(["admin", "moderator"]);

      // Admin tem acesso
      const adminContext: any = {
        user: {
          id: "1",
          email: "admin@example.com",
          roles: ["admin"],
        },
      };

      const adminAccess = await moderatorGuard.canActivate(adminContext);
      expect(adminAccess).toBe(true);

      // Moderator tem acesso
      const modContext: any = {
        user: {
          id: "2",
          email: "mod@example.com",
          roles: ["moderator"],
        },
      };

      const modAccess = await moderatorGuard.canActivate(modContext);
      expect(modAccess).toBe(true);

      // User não tem acesso
      const userContext: any = {
        user: {
          id: "3",
          email: "user@example.com",
          roles: ["user"],
        },
      };

      await expect(moderatorGuard.canActivate(userContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("deve funcionar com guard sem roles (acesso público)", async () => {
      const publicGuard = new RolesGuard();
      publicGuard.setRequiredRoles([]);

      const context: any = {
        user: {
          id: "123",
          email: "anyone@example.com",
          roles: [],
        },
      };

      const result = await publicGuard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
