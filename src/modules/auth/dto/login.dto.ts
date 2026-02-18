export class LoginDto {
  email?: string;
  username?: string;
  password!: string;

  constructor(data: Partial<LoginDto>) {
    Object.assign(this, data);
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.email && !this.username) {
      errors.push("Email ou username é obrigatório");
    }

    if (!this.password) {
      errors.push("Password é obrigatório");
    }

    if (this.password && this.password.length < 6) {
      errors.push("Password deve ter no mínimo 6 caracteres");
    }

    return errors;
  }
}

export class RegisterDto {
  email!: string;
  username?: string;
  password!: string;
  name?: string;

  constructor(data: Partial<RegisterDto>) {
    Object.assign(this, data);
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.email) {
      errors.push("Email é obrigatório");
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push("Email inválido");
    }

    if (!this.password) {
      errors.push("Password é obrigatório");
    }

    if (this.password && this.password.length < 6) {
      errors.push("Password deve ter no mínimo 6 caracteres");
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class RefreshTokenDto {
  refreshToken!: string;

  constructor(data: Partial<RefreshTokenDto>) {
    Object.assign(this, data);
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.refreshToken) {
      errors.push("Refresh token é obrigatório");
    }

    return errors;
  }
}
