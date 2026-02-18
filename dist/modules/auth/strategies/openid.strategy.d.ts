import {
  IAuthStrategy,
  IAuthUser,
  IOpenIDConfig,
} from "../interfaces/auth.interface";
export declare class OpenIDStrategy implements IAuthStrategy {
  readonly name = "openid";
  private config;
  private discoveryDocument;
  constructor(config?: IOpenIDConfig);
  /**
   * Valida o código de autorização OpenID Connect
   * @param credentials - Objeto contendo o código de autorização
   * @returns Dados do usuário ou null se inválido
   */
  validate(credentials: {
    code: string;
    state?: string;
    nonce?: string;
  }): Promise<IAuthUser | null>;
  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getAuthorizationUrl(state?: string, nonce?: string): string;
  /**
   * Descobre a configuração do OpenID Connect usando o discovery endpoint
   */
  private discoverConfiguration;
  /**
   * Troca o código de autorização por tokens
   * @param code - Código de autorização
   * @returns Resposta com tokens (access_token, id_token, refresh_token)
   */
  private exchangeCodeForToken;
  /**
   * Valida o ID Token JWT
   * @param idToken - ID Token JWT
   * @param nonce - Nonce esperado
   * @returns Payload do ID Token
   */
  private validateIdToken;
  /**
   * Obtém informações do usuário usando o token de acesso
   * @param accessToken - Token de acesso
   * @returns Informações do usuário
   */
  private getUserInfo;
  /**
   * Mapeia as informações do OpenID Connect para IAuthUser
   * @param userInfo - Informações do usuário
   * @returns Objeto IAuthUser padronizado
   */
  private mapUserInfo;
  /**
   * Atualiza a configuração do OpenID Connect
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IOpenIDConfig>): void;
  private getAuthorizationUrlFromConfig;
  private getTokenUrlFromConfig;
  private getUserInfoUrl;
}
//# sourceMappingURL=openid.strategy.d.ts.map
