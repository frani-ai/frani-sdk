import { Injectable } from "@core/di/container-decorator";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OAuthStrategy } from "./strategies/oauth.strategy";
import { OpenIDStrategy } from "./strategies/openid.strategy";
import {
  IAuthUser,
  ITokenResponse,
  IAuthStrategy,
} from "./interfaces/auth.interface";
import { UnauthorizedException, BadRequestException } from "@core/http";
import { Logger } from "../logger/logger.service";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private strategies: Map<string, IAuthStrategy> = new Map();

  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly oauthStrategy: OAuthStrategy,
    private readonly openidStrategy: OpenIDStrategy,
    private readonly logger: Logger,
  ) {
    // Registrar estratégias disponíveis
    this.registerStrategy(jwtStrategy);
    this.registerStrategy(oauthStrategy);
    this.registerStrategy(openidStrategy);
  }

  /**
   * Registra uma nova estratégia de autenticação
   * @param strategy - Estratégia a ser registrada
   */
  registerStrategy(strategy: IAuthStrategy): void {
    this.strategies.set(strategy.name, strategy);
    this.logger.log(`Estratégia de autenticação registrada: ${strategy.name}`);
  }

  /**
   * Obtém uma estratégia de autenticação pelo nome
   * @param name - Nome da estratégia
   * @returns Estratégia encontrada ou undefined
   */
  getStrategy(name: string): IAuthStrategy | undefined {
    return this.strategies.get(name);
  }

  /**
   * Autentica um usuário usando a estratégia JWT
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param userValidator - Função para validar credenciais no banco de dados
   * @returns Token de acesso e refresh token
   */
  async loginWithCredentials(
    email: string,
    password: string,
    userValidator: (
      email: string,
    ) => Promise<{
      id: string | number;
      password: string;
      [key: string]: any;
    } | null>,
  ): Promise<ITokenResponse> {
    try {
      // Buscar usuário no banco de dados
      const user = await userValidator(email);

      if (!user) {
        throw new UnauthorizedException("Credenciais inválidas");
      }

      // Verificar senha
      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException("Credenciais inválidas");
      }

      // Remover senha do objeto do usuário
      const { password: _, ...userWithoutPassword } = user;

      // Gerar tokens
      const tokens = this.jwtStrategy.generateTokenPair(
        userWithoutPassword as IAuthUser,
      );

      this.logger.log("Usuário autenticado com sucesso", { userId: user.id });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: "Bearer",
      };
    } catch (error) {
      this.logger.error("Falha na autenticação", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Autentica um usuário usando OAuth
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário autenticado
   */
  async loginWithOAuth(code: string, state?: string): Promise<IAuthUser> {
    try {
      const credentials: { code: string; state?: string } = { code };
      if (state !== undefined) {
        credentials.state = state;
      }

      const user = await this.oauthStrategy.validate(credentials);

      if (!user) {
        throw new UnauthorizedException("Falha na autenticação OAuth");
      }

      this.logger.log("Usuário autenticado via OAuth", { userId: user.id });

      return user;
    } catch (error) {
      this.logger.error("Falha na autenticação OAuth", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Autentica um usuário usando OpenID Connect
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário autenticado
   */
  async loginWithOpenID(
    code: string,
    state?: string,
    nonce?: string,
  ): Promise<IAuthUser> {
    try {
      const credentials: { code: string; state?: string; nonce?: string } = {
        code,
      };
      if (state !== undefined) {
        credentials.state = state;
      }
      if (nonce !== undefined) {
        credentials.nonce = nonce;
      }

      const user = await this.openidStrategy.validate(credentials);

      if (!user) {
        throw new UnauthorizedException("Falha na autenticação OpenID Connect");
      }

      this.logger.log("Usuário autenticado via OpenID Connect", {
        userId: user.id,
      });

      return user;
    } catch (error) {
      this.logger.error("Falha na autenticação OpenID Connect", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Valida um token JWT
   * @param token - Token JWT
   * @returns Dados do usuário ou null se inválido
   */
  async validateToken(token: string): Promise<IAuthUser | null> {
    return this.jwtStrategy.validate({ token });
  }

  /**
   * Atualiza o token de acesso usando um refresh token
   * @param refreshToken - Refresh token
   * @returns Novo token de acesso
   */
  async refreshAccessToken(refreshToken: string): Promise<ITokenResponse> {
    try {
      const user = await this.jwtStrategy.validate({ token: refreshToken });

      if (!user) {
        throw new UnauthorizedException("Refresh token inválido");
      }

      const accessToken = this.jwtStrategy.sign(user);

      this.logger.log("Token atualizado com sucesso", { userId: user.id });

      return {
        accessToken,
        tokenType: "Bearer",
      };
    } catch (error) {
      this.logger.error("Falha ao atualizar token", {
        error: (error as Error).message,
      });
      throw new UnauthorizedException("Refresh token inválido");
    }
  }

  /**
   * Gera hash de senha usando bcrypt
   * @param password - Senha em texto plano
   * @param rounds - Número de rounds do salt (padrão: 10)
   * @returns Hash da senha
   */
  async hashPassword(password: string, rounds: number = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  /**
   * Compara uma senha em texto plano com um hash
   * @param password - Senha em texto plano
   * @param hash - Hash da senha
   * @returns true se as senhas correspondem, false caso contrário
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns URL de autorização
   */
  getOAuthAuthorizationUrl(state?: string): string {
    return this.oauthStrategy.getAuthorizationUrl(state);
  }

  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getOpenIDAuthorizationUrl(state?: string, nonce?: string): string {
    return this.openidStrategy.getAuthorizationUrl(state, nonce);
  }

  /**
   * Verifica se um token JWT está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isTokenExpired(token: string): boolean {
    return this.jwtStrategy.isExpired(token);
  }
}
