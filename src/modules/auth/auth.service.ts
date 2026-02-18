import { Injectable } from "@core/di/container-decorator";
import { Container } from "@core/di/container";
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

  constructor(private readonly logger: Logger) {
    // Registrar estratégias disponíveis dinamicamente
    this.loadStrategies();
  }

  /**
   * Carrega estratégias disponíveis do Container
   */
  private loadStrategies(): void {
    // Verificar quais estratégias foram registradas no Container
    const containerInstances = (Container as any).instances;

    // Carregar apenas estratégias que foram explicitamente registradas
    if (containerInstances.has(JwtStrategy)) {
      const jwtStrategy = Container.resolve(JwtStrategy);
      this.registerStrategy(jwtStrategy);
    }

    if (containerInstances.has(OAuthStrategy)) {
      const oauthStrategy = Container.resolve(OAuthStrategy);
      this.registerStrategy(oauthStrategy);
    }

    if (containerInstances.has(OpenIDStrategy)) {
      const openidStrategy = Container.resolve(OpenIDStrategy);
      this.registerStrategy(openidStrategy);
    }
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
   * Gera par de tokens (access + refresh) para um usuário.
   * Use no seu backend após validar credenciais (login) ou após OAuth/OpenID.
   * @param user - Usuário (sem senha)
   * @returns accessToken, refreshToken e tokenType
   */
  generateTokenPair(user: IAuthUser): ITokenResponse {
    const jwtStrategy = this.getStrategy("jwt") as JwtStrategy;
    if (!jwtStrategy) {
      throw new BadRequestException("Estratégia JWT não está habilitada");
    }
    const tokens = jwtStrategy.generateTokenPair(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: "Bearer",
    };
  }

  /**
   * Obtém usuário do provedor OAuth (troca code por token e user info).
   * O backend usa onOAuthCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização OAuth
   * @param state - Estado para CSRF protection
   * @returns Dados do usuário retornados pelo provedor
   */
  async getOAuthUserFromCode(code: string, state?: string): Promise<IAuthUser> {
    try {
      const credentials: { code: string; state?: string } = { code };
      if (state !== undefined) {
        credentials.state = state;
      }

      const oauthStrategy = this.getStrategy("oauth") as OAuthStrategy;
      const user = await oauthStrategy.validate(credentials);

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
   * Obtém usuário do provedor OpenID (troca code por token e user info).
   * O backend usa onOpenIDCallback para encontrar/criar usuário e depois generateTokenPair.
   * @param code - Código de autorização
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns Dados do usuário retornados pelo provedor
   */
  async getOpenIDUserFromCode(
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

      const openidStrategy = this.getStrategy("openid") as OpenIDStrategy;
      const user = await openidStrategy.validate(credentials);

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
    const jwtStrategy = this.getStrategy("jwt") as JwtStrategy;
    return jwtStrategy.validate({ token });
  }

  /**
   * Atualiza o token de acesso usando um refresh token
   * @param refreshToken - Refresh token
   * @returns Novo token de acesso
   */
  async refreshAccessToken(refreshToken: string): Promise<ITokenResponse> {
    try {
      const jwtStrategy = this.getStrategy("jwt") as JwtStrategy;
      const user = await jwtStrategy.validate({ token: refreshToken });

      if (!user) {
        throw new UnauthorizedException("Refresh token inválido");
      }

      const accessToken = jwtStrategy.sign(user);

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
    const oauthStrategy = this.getStrategy("oauth") as OAuthStrategy;
    return oauthStrategy.getAuthorizationUrl(state);
  }

  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getOpenIDAuthorizationUrl(state?: string, nonce?: string): string {
    const openidStrategy = this.getStrategy("openid") as OpenIDStrategy;
    return openidStrategy.getAuthorizationUrl(state, nonce);
  }

  /**
   * Verifica se um token JWT está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isTokenExpired(token: string): boolean {
    const jwtStrategy = this.getStrategy("jwt") as JwtStrategy;
    return jwtStrategy.isExpired(token);
  }
}
