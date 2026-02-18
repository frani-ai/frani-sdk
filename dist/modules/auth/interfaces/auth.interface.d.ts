export interface IAuthStrategy {
  /**
   * Valida as credenciais do usuário
   * @param credentials - Credenciais fornecidas pelo usuário
   * @returns Dados do usuário autenticado ou null se inválido
   */
  validate(credentials: any): Promise<IAuthUser | null>;
  /**
   * Nome da estratégia de autenticação
   */
  readonly name: string;
}
export interface IAuthUser {
  id: string | number;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: any;
}
export interface IJwtPayload {
  sub: string | number;
  email?: string;
  username?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  [key: string]: any;
}
export interface IJwtConfig {
  secret: string;
  expiresIn?: string | number;
  algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";
  issuer?: string;
  audience?: string;
}
export interface IOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope?: string[];
}
export interface IOpenIDConfig extends IOAuthConfig {
  discoveryUrl?: string;
  jwksUri?: string;
  issuer?: string;
}
export interface ITokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}
export interface IAuthGuard {
  /**
   * Verifica se a requisição está autenticada
   * @param context - Contexto da requisição HTTP
   * @returns true se autenticado, false caso contrário
   */
  canActivate(context: any): Promise<boolean>;
}
//# sourceMappingURL=auth.interface.d.ts.map
