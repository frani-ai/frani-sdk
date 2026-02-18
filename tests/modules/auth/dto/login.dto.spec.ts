import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
} from "../../../../src/modules/auth/dto/login.dto";

describe("Auth DTOs", () => {
  describe("LoginDto", () => {
    describe("constructor", () => {
      it("deve criar uma instância com email e password", () => {
        const dto = new LoginDto({
          email: "test@example.com",
          password: "password123",
        });

        expect(dto.email).toBe("test@example.com");
        expect(dto.password).toBe("password123");
      });

      it("deve criar uma instância com username e password", () => {
        const dto = new LoginDto({
          username: "testuser",
          password: "password123",
        });

        expect(dto.username).toBe("testuser");
        expect(dto.password).toBe("password123");
      });

      it("deve criar uma instância com dados parciais", () => {
        const dto = new LoginDto({
          email: "test@example.com",
        });

        expect(dto.email).toBe("test@example.com");
      });
    });

    describe("validate", () => {
      it("deve retornar array vazio para dados válidos com email", () => {
        const dto = new LoginDto({
          email: "test@example.com",
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toEqual([]);
      });

      it("deve retornar array vazio para dados válidos com username", () => {
        const dto = new LoginDto({
          username: "testuser",
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toEqual([]);
      });

      it("deve retornar erro quando email e username não são fornecidos", () => {
        const dto = new LoginDto({
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toContain("Email ou username é obrigatório");
      });

      it("deve retornar erro quando password não é fornecido", () => {
        const dto = new LoginDto({
          email: "test@example.com",
        });

        const errors = dto.validate();

        expect(errors).toContain("Password é obrigatório");
      });

      it("deve retornar erro quando password é muito curto", () => {
        const dto = new LoginDto({
          email: "test@example.com",
          password: "12345",
        });

        const errors = dto.validate();

        expect(errors).toContain("Password deve ter no mínimo 6 caracteres");
      });

      it("deve retornar múltiplos erros quando múltiplos campos são inválidos", () => {
        const dto = new LoginDto({});

        const errors = dto.validate();

        expect(errors.length).toBeGreaterThan(0);
        expect(errors).toContain("Email ou username é obrigatório");
        expect(errors).toContain("Password é obrigatório");
      });

      it("deve aceitar password com exatamente 6 caracteres", () => {
        const dto = new LoginDto({
          email: "test@example.com",
          password: "123456",
        });

        const errors = dto.validate();

        expect(errors).toEqual([]);
      });
    });
  });

  describe("RegisterDto", () => {
    describe("constructor", () => {
      it("deve criar uma instância com todos os campos", () => {
        const dto = new RegisterDto({
          email: "test@example.com",
          username: "testuser",
          password: "password123",
          name: "Test User",
        });

        expect(dto.email).toBe("test@example.com");
        expect(dto.username).toBe("testuser");
        expect(dto.password).toBe("password123");
        expect(dto.name).toBe("Test User");
      });

      it("deve criar uma instância sem campos opcionais", () => {
        const dto = new RegisterDto({
          email: "test@example.com",
          password: "password123",
        });

        expect(dto.email).toBe("test@example.com");
        expect(dto.password).toBe("password123");
        expect(dto.username).toBeUndefined();
        expect(dto.name).toBeUndefined();
      });
    });

    describe("validate", () => {
      it("deve retornar array vazio para dados válidos", () => {
        const dto = new RegisterDto({
          email: "test@example.com",
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toEqual([]);
      });

      it("deve retornar erro quando email não é fornecido", () => {
        const dto = new RegisterDto({
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toContain("Email é obrigatório");
      });

      it("deve retornar erro para email inválido", () => {
        const dto = new RegisterDto({
          email: "invalid-email",
          password: "password123",
        });

        const errors = dto.validate();

        expect(errors).toContain("Email inválido");
      });

      it("deve aceitar emails válidos", () => {
        const validEmails = [
          "test@example.com",
          "user.name@example.co.uk",
          "user+tag@example.com",
          "user_name@example.com",
        ];

        validEmails.forEach((email) => {
          const dto = new RegisterDto({
            email,
            password: "password123",
          });

          const errors = dto.validate();

          expect(errors).not.toContain("Email inválido");
        });
      });

      it("deve rejeitar emails inválidos", () => {
        const invalidEmails = [
          "invalid",
          "@example.com",
          "user@",
          "user @example.com",
          "user@example",
        ];

        invalidEmails.forEach((email) => {
          const dto = new RegisterDto({
            email,
            password: "password123",
          });

          const errors = dto.validate();

          expect(errors).toContain("Email inválido");
        });
      });

      it("deve retornar erro quando password não é fornecido", () => {
        const dto = new RegisterDto({
          email: "test@example.com",
        });

        const errors = dto.validate();

        expect(errors).toContain("Password é obrigatório");
      });

      it("deve retornar erro quando password é muito curto", () => {
        const dto = new RegisterDto({
          email: "test@example.com",
          password: "12345",
        });

        const errors = dto.validate();

        expect(errors).toContain("Password deve ter no mínimo 6 caracteres");
      });

      it("deve retornar múltiplos erros", () => {
        const dto = new RegisterDto({
          email: "invalid-email",
          password: "123",
        });

        const errors = dto.validate();

        expect(errors.length).toBeGreaterThan(1);
        expect(errors).toContain("Email inválido");
        expect(errors).toContain("Password deve ter no mínimo 6 caracteres");
      });
    });
  });

  describe("RefreshTokenDto", () => {
    describe("constructor", () => {
      it("deve criar uma instância com refreshToken", () => {
        const dto = new RefreshTokenDto({
          refreshToken: "valid-refresh-token",
        });

        expect(dto.refreshToken).toBe("valid-refresh-token");
      });
    });

    describe("validate", () => {
      it("deve retornar array vazio para refreshToken válido", () => {
        const dto = new RefreshTokenDto({
          refreshToken: "valid-refresh-token",
        });

        const errors = dto.validate();

        expect(errors).toEqual([]);
      });

      it("deve retornar erro quando refreshToken não é fornecido", () => {
        const dto = new RefreshTokenDto({});

        const errors = dto.validate();

        expect(errors).toContain("Refresh token é obrigatório");
      });

      it("deve retornar erro quando refreshToken é string vazia", () => {
        const dto = new RefreshTokenDto({
          refreshToken: "",
        });

        const errors = dto.validate();

        expect(errors).toContain("Refresh token é obrigatório");
      });

      it("deve aceitar qualquer string não vazia como refreshToken", () => {
        const tokens = [
          "short",
          "very-long-refresh-token-with-many-characters",
          "token.with.dots",
          "token_with_underscores",
        ];

        tokens.forEach((token) => {
          const dto = new RefreshTokenDto({
            refreshToken: token,
          });

          const errors = dto.validate();

          expect(errors).toEqual([]);
        });
      });
    });
  });
});
