"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDto = exports.RegisterDto = exports.LoginDto = void 0;
class LoginDto {
  constructor(data) {
    Object.assign(this, data);
  }
  validate() {
    const errors = [];
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
exports.LoginDto = LoginDto;
class RegisterDto {
  constructor(data) {
    Object.assign(this, data);
  }
  validate() {
    const errors = [];
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
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
exports.RegisterDto = RegisterDto;
class RefreshTokenDto {
  constructor(data) {
    Object.assign(this, data);
  }
  validate() {
    const errors = [];
    if (!this.refreshToken) {
      errors.push("Refresh token é obrigatório");
    }
    return errors;
  }
}
exports.RefreshTokenDto = RefreshTokenDto;
//# sourceMappingURL=login.dto.js.map
