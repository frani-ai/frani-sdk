import { Injectable } from "@core/di/container-decorator";
import { IAuthGuard } from "../interfaces/auth.interface";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { HttpContext } from "@core/http/interfaces/exception-filter.interface";
import { UnauthorizedException } from "@core/http";

@Injectable()
export class JwtAuthGuard implements IAuthGuard {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  /**
   * Verifica se a requisição possui um token JWT válido
   * @param context - Contexto da requisição HTTP
   * @returns true se autenticado, false caso contrário
   */
  async canActivate(context: HttpContext): Promise<boolean> {
    try {
      const token = this.extractTokenFromHeader(context);

      if (!token) {
        throw new UnauthorizedException("Token não fornecido");
      }

      const user = await this.jwtStrategy.validate({ token });

      if (!user) {
        throw new UnauthorizedException("Token inválido");
      }

      // Adicionar usuário ao contexto para uso posterior
      (context as any).user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Falha na autenticação");
    }
  }

  /**
   * Extrai o token JWT do header Authorization
   * @param context - Contexto da requisição
   * @returns Token JWT ou null
   */
  private extractTokenFromHeader(context: HttpContext): string | null {
    const authHeader = context.request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return null;
    }

    return token;
  }
}
