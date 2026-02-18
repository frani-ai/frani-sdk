import { Injectable } from "@core/di/container-decorator";
import {
  IAuthStrategy,
  IAuthUser,
  IOpenIDConfig,
} from "../interfaces/auth.interface";
import { UnauthorizedException, BadRequestException } from "@core/http";
import jwt from "jsonwebtoken";

@Injectable()
export class OpenIDStrategy implements IAuthStrategy {
  readonly name = "openid";
  private config: IOpenIDConfig;
  private discoveryDocument: any = null;

  constructor(config?: IOpenIDConfig) {
    this.config = config || {
      clientId: process.env.OPENID_CLIENT_ID || "",
      clientSecret: process.env.OPENID_CLIENT_SECRET || "",
      redirectUri: process.env.OPENID_REDIRECT_URI || "",
      authorizationUrl: process.env.OPENID_AUTHORIZATION_URL || "",
      tokenUrl: process.env.OPENID_TOKEN_URL || "",
      userInfoUrl: process.env.OPENID_USER_INFO_URL || "",
      discoveryUrl: process.env.OPENID_DISCOVERY_URL || "",
      issuer: process.env.OPENID_ISSUER || "",
      scope: (process.env.OPENID_SCOPE || "openid profile email").split(" "),
    };
  }

  /**
   * Valida o código de autorização OpenID Connect
   * @param credentials - Objeto contendo o código de autorização
   * @returns Dados do usuário ou null se inválido
   */
  async validate(credentials: {
    code: string;
    state?: string;
    nonce?: string;
  }): Promise<IAuthUser | null> {
    try {
      const { code, nonce } = credentials;

      if (!code) {
        throw new BadRequestException("Código de autorização é obrigatório");
      }

      // Descobrir endpoints se necessário
      if (this.config.discoveryUrl && !this.discoveryDocument) {
        await this.discoverConfiguration();
      }

      // Trocar código por tokens
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Validar ID Token
      const idTokenPayload = await this.validateIdToken(
        tokenResponse.id_token,
        nonce,
      );

      // Opcionalmente, obter informações adicionais do userinfo endpoint
      let userInfo = idTokenPayload;
      if (tokenResponse.access_token && this.getUserInfoUrl()) {
        try {
          userInfo = {
            ...idTokenPayload,
            ...(await this.getUserInfo(tokenResponse.access_token)),
          };
        } catch (error) {
          // Se falhar, usar apenas o ID token
        }
      }

      return this.mapUserInfo(userInfo);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException("Falha na autenticação OpenID Connect");
    }
  }

  /**
   * Gera a URL de autorização OpenID Connect
   * @param state - Estado para CSRF protection
   * @param nonce - Nonce para validação do ID token
   * @returns URL de autorização
   */
  getAuthorizationUrl(state?: string, nonce?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scope?.join(" ") || "openid profile email",
    });

    if (state) {
      params.append("state", state);
    }

    if (nonce) {
      params.append("nonce", nonce);
    }

    const authUrl = this.getAuthorizationUrlFromConfig();
    return `${authUrl}?${params.toString()}`;
  }

  /**
   * Descobre a configuração do OpenID Connect usando o discovery endpoint
   */
  private async discoverConfiguration(): Promise<void> {
    if (!this.config.discoveryUrl) {
      return;
    }

    try {
      const response = await fetch(this.config.discoveryUrl);
      if (!response.ok) {
        throw new Error("Falha ao descobrir configuração OpenID");
      }

      this.discoveryDocument = await response.json();

      // Atualizar configuração com endpoints descobertos
      if (this.discoveryDocument.authorization_endpoint) {
        this.config.authorizationUrl =
          this.discoveryDocument.authorization_endpoint;
      }
      if (this.discoveryDocument.token_endpoint) {
        this.config.tokenUrl = this.discoveryDocument.token_endpoint;
      }
      if (this.discoveryDocument.userinfo_endpoint) {
        this.config.userInfoUrl = this.discoveryDocument.userinfo_endpoint;
      }
      if (this.discoveryDocument.jwks_uri) {
        this.config.jwksUri = this.discoveryDocument.jwks_uri;
      }
      if (this.discoveryDocument.issuer) {
        this.config.issuer = this.discoveryDocument.issuer;
      }
    } catch (error) {
      throw new UnauthorizedException(
        "Falha ao descobrir configuração OpenID Connect",
      );
    }
  }

  /**
   * Troca o código de autorização por tokens
   * @param code - Código de autorização
   * @returns Resposta com tokens (access_token, id_token, refresh_token)
   */
  private async exchangeCodeForToken(code: string): Promise<any> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    const tokenUrl = this.getTokenUrlFromConfig();
    const response = await fetch(tokenUrl, {
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
   * Valida o ID Token JWT
   * @param idToken - ID Token JWT
   * @param nonce - Nonce esperado
   * @returns Payload do ID Token
   */
  private async validateIdToken(idToken: string, nonce?: string): Promise<any> {
    try {
      // Decodificar sem verificar (apenas para inspeção)
      const decoded = jwt.decode(idToken, { complete: true }) as any;

      if (!decoded) {
        throw new UnauthorizedException("ID Token inválido");
      }

      // Validar issuer
      if (this.config.issuer && decoded.payload.iss !== this.config.issuer) {
        throw new UnauthorizedException("Issuer do ID Token inválido");
      }

      // Validar audience
      if (decoded.payload.aud !== this.config.clientId) {
        throw new UnauthorizedException("Audience do ID Token inválido");
      }

      // Validar expiração
      if (decoded.payload.exp && decoded.payload.exp * 1000 < Date.now()) {
        throw new UnauthorizedException("ID Token expirado");
      }

      // Validar nonce se fornecido
      if (nonce && decoded.payload.nonce !== nonce) {
        throw new UnauthorizedException("Nonce do ID Token inválido");
      }

      return decoded.payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Falha ao validar ID Token");
    }
  }

  /**
   * Obtém informações do usuário usando o token de acesso
   * @param accessToken - Token de acesso
   * @returns Informações do usuário
   */
  private async getUserInfo(accessToken: string): Promise<any> {
    const userInfoUrl = this.getUserInfoUrl();
    if (!userInfoUrl) {
      return {};
    }

    const response = await fetch(userInfoUrl, {
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
   * Mapeia as informações do OpenID Connect para IAuthUser
   * @param userInfo - Informações do usuário
   * @returns Objeto IAuthUser padronizado
   */
  private mapUserInfo(userInfo: any): IAuthUser {
    return {
      id: userInfo.sub,
      email: userInfo.email,
      username:
        userInfo.preferred_username || userInfo.username || userInfo.email,
      name: userInfo.name,
      givenName: userInfo.given_name,
      familyName: userInfo.family_name,
      picture: userInfo.picture,
      emailVerified: userInfo.email_verified,
      roles: userInfo.roles || [],
    };
  }

  /**
   * Atualiza a configuração do OpenID Connect
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IOpenIDConfig>): void {
    this.config = { ...this.config, ...config };
    this.discoveryDocument = null; // Reset discovery document
  }

  private getAuthorizationUrlFromConfig(): string {
    return (
      this.discoveryDocument?.authorization_endpoint ||
      this.config.authorizationUrl
    );
  }

  private getTokenUrlFromConfig(): string {
    return this.discoveryDocument?.token_endpoint || this.config.tokenUrl;
  }

  private getUserInfoUrl(): string {
    return this.discoveryDocument?.userinfo_endpoint || this.config.userInfoUrl;
  }
}
