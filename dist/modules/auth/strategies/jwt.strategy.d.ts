import {
  IAuthStrategy,
  IAuthUser,
  IJwtPayload,
  IJwtConfig,
} from "../interfaces/auth.interface";
export declare class JwtStrategy implements IAuthStrategy {
  readonly name = "jwt";
  private config;
  constructor(config?: IJwtConfig);
  /**
   * Valida um token JWT
   * @param credentials - Objeto contendo o token JWT
   * @returns Dados do usuário ou null se inválido
   */
  validate(credentials: { token: string }): Promise<IAuthUser | null>;
  /**
   * Gera um token JWT para um usuário
   * @param user - Dados do usuário
   * @returns Token JWT assinado
   */
  sign(user: IAuthUser): string;
  /**
   * Gera um par de tokens (access e refresh)
   * @param user - Dados do usuário
   * @returns Objeto com accessToken e refreshToken
   */
  generateTokenPair(user: IAuthUser): {
    accessToken: string;
    refreshToken: string;
  };
  /**
   * Valida e decodifica um token sem verificar a assinatura
   * @param token - Token JWT
   * @returns Payload decodificado ou null
   */
  decode(token: string): IJwtPayload | null;
  /**
   * Verifica se um token está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isExpired(token: string): boolean;
  /**
   * Atualiza a configuração do JWT
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IJwtConfig>): void;
  private payloadToUser;
}
//# sourceMappingURL=jwt.strategy.d.ts.map
