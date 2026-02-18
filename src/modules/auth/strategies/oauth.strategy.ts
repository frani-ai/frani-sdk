import { Injectable } from "@core/di/container-decorator";
import {
  IAuthStrategy,
  IAuthUser,
  IOAuthConfig,
} from "../interfaces/auth.interface";
import { UnauthorizedException, BadRequestException } from "@core/http";

@Injectable()
export class OAuthStrategy implements IAuthStrategy {
  readonly name = "oauth";
  private config: IOAuthConfig;

  constructor(config?: IOAuthConfig) {
    this.config = config || {
      clientId: process.env.OAUTH_CLIENT_ID || "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
      redirectUri: process.env.OAUTH_REDIRECT_URI || "",
      authorizationUrl: process.env.OAUTH_AUTHORIZATION_URL || "",
      tokenUrl: process.env.OAUTH_TOKEN_URL || "",
      userInfoUrl: process.env.OAUTH_USER_INFO_URL || "",
      scope: (process.env.OAUTH_SCOPE || "openid profile email").split(" "),
    };
  }

  /**
   * Valida o código de autorização OAuth
   * @param credentials - Objeto contendo o código de autorização
   * @returns Dados do usuário ou null se inválido
   */
  async validate(credentials: {
    code: string;
    state?: string;
  }): Promise<IAuthUser | null> {
    try {
      const { code } = credentials;

      if (!code) {
        throw new BadRequestException("Código de autorização é obrigatório");
      }

      // Trocar código por token de acesso
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Obter informações do usuário
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      return this.mapUserInfo(userInfo);
    } catch (error) {
      throw new UnauthorizedException("Falha na autenticação OAuth");
    }
  }

  /**
   * Gera a URL de autorização OAuth
   * @param state - Estado opcional para CSRF protection
   * @returns URL de autorização
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scope?.join(" ") || "openid profile email",
    });

    if (state) {
      params.append("state", state);
    }

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Troca o código de autorização por um token de acesso
   * @param code - Código de autorização
   * @returns Resposta com tokens
   */
  private async exchangeCodeForToken(code: string): Promise<any> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new UnauthorizedException("Falha ao trocar código por token");
    }

    return response.json();
  }

  /**
   * Obtém informações do usuário usando o token de acesso
   * @param accessToken - Token de acesso
   * @returns Informações do usuário
   */
  private async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(this.config.userInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException("Falha ao obter informações do usuário");
    }

    return response.json();
  }

  /**
   * Mapeia as informações do provedor OAuth para IAuthUser
   * @param userInfo - Informações do usuário do provedor
   * @returns Objeto IAuthUser padronizado
   */
  private mapUserInfo(userInfo: any): IAuthUser {
    return {
      id: userInfo.sub || userInfo.id,
      email: userInfo.email,
      username:
        userInfo.preferred_username || userInfo.username || userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      roles: userInfo.roles || [],
    };
  }

  /**
   * Atualiza a configuração do OAuth
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IOAuthConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
