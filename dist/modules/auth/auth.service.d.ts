import { JwtStrategy } from "./strategies/jwt.strategy";
import { OAuthStrategy } from "./strategies/oauth.strategy";
import { OpenIDStrategy } from "./strategies/openid.strategy";
import {
  IAuthUser,
  ITokenResponse,
  IAuthStrategy,
} from "./interfaces/auth.interface";
import { Logger } from "../logger/logger.service";
export declare class AuthService {
  private readonly jwtStrategy;
  private readonly oauthStrategy;
  private readonly openidStrategy;
  private readonly logger;
  private strategies;
  constructor(
    jwtStrategy: JwtStrategy,
    oauthStrategy: OAuthStrategy,
    openidStrategy: OpenIDStrategy,
    logger: Logger,
  );
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
   * Autentica um usuário usando a estratégia JWT
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param userValidator - Função para validar credenciais no banco de dados
   * @returns Token de acesso e refresh token
   */
  loginWithCredentials(
    email: string,
    password: string,
    userValidator: (email: string) => Promise<{
      id: string | number;
      password: string;
      [key: string]: any;
    } | null>,
  ): Promise<ITokenResponse>;
  /**
   * Autentica um usuário usando OAuth
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário autenticado
   */
  loginWithOAuth(code: string, state?: string): Promise<IAuthUser>;
  /**
   * Autentica um usuário usando OpenID Connect
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário autenticado
   */
  loginWithOpenID(
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
