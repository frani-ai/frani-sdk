import {
  IAuthUser,
  ITokenResponse,
  IAuthStrategy,
} from "./interfaces/auth.interface";
import { Logger } from "../logger/logger.service";
export declare class AuthService {
  private readonly logger;
  private strategies;
  constructor(logger: Logger);
  /**
   * Carrega estratégias disponíveis do Container
   */
  private loadStrategies;
  /**
   * Registra uma nova estratégia de autenticação
   * @param strategy - Estratégia a ser registrada
   */
  registerStrategy(strategy: IAuthStrategy): void;
  /**
   * Obtém uma estratégia de autenticação pelo nome
   * @param name - Nome da estratégia
   * @returns Estratégia encontrada ou undefined
   */
  getStrategy(name: string): IAuthStrategy | undefined;
  /**
   * Gera par de tokens (access + refresh) para um usuário.
   * Use no seu backend após validar credenciais (login) ou após OAuth/OpenID.
   * @param user - Usuário (sem senha)
   * @returns accessToken, refreshToken e tokenType
   */
  generateTokenPair(user: IAuthUser): ITokenResponse;
  /**
   * Obtém usuário do provedor OAuth (troca code por token e user info).
   * O backend usa onOAuthCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário retornados pelo provedor
   */
  getOAuthUserFromCode(code: string, state?: string): Promise<IAuthUser>;
  /**
   * Obtém usuário do provedor OpenID (troca code por token e user info).
   * O backend usa onOpenIDCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário retornados pelo provedor
   */
  getOpenIDUserFromCode(
    code: string,
    state?: string,
    nonce?: string,
  ): Promise<IAuthUser>;
  /**
   * Valida um token JWT
   * @param token - Token JWT
   * @returns Dados do usuário ou null se inválido
   */
  validateToken(token: string): Promise<IAuthUser | null>;
  /**
   * Atualiza o token de acesso usando um refresh token
   * @param refreshToken - Refresh token
   * @returns Novo token de acesso
   */
  refreshAccessToken(refreshToken: string): Promise<ITokenResponse>;
  /**
   * Gera hash de senha usando bcrypt
   * @param password - Senha em texto plano
   * @param rounds - Número de rounds do salt (padrão: 10)
   * @returns Hash da senha
   */
  hashPassword(password: string, rounds?: number): Promise<string>;
  /**
   * Compara uma senha em texto plano com um hash
   * @param password - Senha em texto plano
   * @param hash - Hash da senha
   * @returns true se as senhas correspondem, false caso contrário
   */
  comparePassword(password: string, hash: string): Promise<boolean>;
  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns URL de autorização
   */
  getOAuthAuthorizationUrl(state?: string): string;
  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getOpenIDAuthorizationUrl(state?: string, nonce?: string): string;
  /**
   * Verifica se um token JWT está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isTokenExpired(token: string): boolean;
}
//# sourceMappingURL=auth.service.d.ts.map
