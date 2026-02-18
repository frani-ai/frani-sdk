import jwt from "jsonwebtoken";
import { Injectable } from "@core/di/container-decorator";
import {
  IAuthStrategy,
  IAuthUser,
  IJwtPayload,
  IJwtConfig,
} from "../interfaces/auth.interface";
import { UnauthorizedException } from "@core/http";

@Injectable()
export class JwtStrategy implements IAuthStrategy {
  readonly name = "jwt";
  private config: IJwtConfig;

  constructor(config?: IJwtConfig) {
    this.config = config || {
      secret: process.env.JWT_SECRET || "default-secret-change-in-production",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      algorithm: "HS256",
    };
  }

  /**
   * Valida um token JWT
   * @param credentials - Objeto contendo o token JWT
   * @returns Dados do usuário ou null se inválido
   */
  async validate(credentials: { token: string }): Promise<IAuthUser | null> {
    try {
      const { token } = credentials;

      if (!token) {
        return null;
      }

      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm || "HS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      }) as IJwtPayload;

      return this.payloadToUser(decoded);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera um token JWT para um usuário
   * @param user - Dados do usuário
   * @returns Token JWT assinado
   */
  sign(user: IAuthUser): string {
    const payload: any = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    };

    const options: any = {
      expiresIn: this.config.expiresIn || "1h",
      algorithm: this.config.algorithm || "HS256",
    };

    if (this.config.issuer) {
      options.issuer = this.config.issuer;
    }

    if (this.config.audience) {
      options.audience = this.config.audience;
    }

    return jwt.sign(payload, this.config.secret, options);
  }

  /**
   * Gera um par de tokens (access e refresh)
   * @param user - Dados do usuário
   * @returns Objeto com accessToken e refreshToken
   */
  generateTokenPair(user: IAuthUser): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.sign(user);

    const refreshPayload: IJwtPayload = {
      sub: user.id,
      type: "refresh",
    };

    const refreshToken = jwt.sign(refreshPayload, this.config.secret, {
      expiresIn: "7d", // Refresh token válido por 7 dias
      algorithm: this.config.algorithm || "HS256",
    });

    return { accessToken, refreshToken };
  }

  /**
   * Valida e decodifica um token sem verificar a assinatura
   * @param token - Token JWT
   * @returns Payload decodificado ou null
   */
  decode(token: string): IJwtPayload | null {
    try {
      return jwt.decode(token) as IJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica se um token está expirado
   * @param token - Token JWT
   * @returns true se expirado, false caso contrário
   */
  isExpired(token: string): boolean {
    const decoded = this.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    return decoded.exp * 1000 < Date.now();
  }

  /**
   * Atualiza a configuração do JWT
   * @param config - Nova configuração
   */
  updateConfig(config: Partial<IJwtConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private payloadToUser(payload: IJwtPayload): IAuthUser {
    const user: IAuthUser = {
      id: payload.sub,
    };

    if (payload.email) user.email = payload.email;
    if (payload.username) user.username = payload.username;
    if (payload.roles) user.roles = payload.roles;

    return user;
  }
}
