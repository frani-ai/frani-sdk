import {
  IAuthStrategy,
  IAuthUser,
  IOAuthConfig,
} from "../interfaces/auth.interface";
export declare class OAuthStrategy implements IAuthStrategy {
  readonly name = "oauth";
  private config;
  constructor(config?: IOAuthConfig);
  /**
   * Valida o código de autorização OAuth
   * @param credentials - Objeto contendo o código de autorização
   * @returns Dados do usuário ou null se inválido
   */
  validate(credentials: {
    code: string;
    state?: string;
  }): Promise<IAuthUser | null>;
  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado opcional para CSRF protection
   * @returns URL de autorização
   */
  getAuthorizationUrl(state?: string): string;
  /**
   * Troca o código de autorização por um token de acesso
   * @param code - Código de autorização
   * @returns Resposta com tokens
   */
  private exchangeCodeForToken;
  /**
   * Obtém informações do usuário usando o token de acesso
   * @param accessToken - Token de acesso
   * @returns Informações do usuário
   */
  private getUserInfo;
  /**
   * Mapeia as informações do provedor OAuth para IAuthUser
   * @param userInfo - Informações do usuário do provedor
   * @returns Objeto IAuthUser padronizado
   */
  private mapUserInfo;
  /**
   * Atualiza a configuração do OAuth
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IOAuthConfig>): void;
}
//# sourceMappingURL=oauth.strategy.d.ts.map
