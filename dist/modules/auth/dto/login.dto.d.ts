export declare class LoginDto {
  email?: string;
  username?: string;
  password: string;
  constructor(data: Partial<LoginDto>);
  validate(): string[];
}
export declare class RegisterDto {
  email: string;
  username?: string;
  password: string;
  name?: string;
  constructor(data: Partial<RegisterDto>);
  validate(): string[];
  private isValidEmail;
}
export declare class RefreshTokenDto {
  refreshToken: string;
  constructor(data: Partial<RefreshTokenDto>);
  validate(): string[];
}
//# sourceMappingURL=login.dto.d.ts.map
