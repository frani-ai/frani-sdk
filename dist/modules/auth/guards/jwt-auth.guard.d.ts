import { IAuthGuard } from "../interfaces/auth.interface";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { HttpContext } from "../../../core/http/interfaces/exception-filter.interface";
export declare class JwtAuthGuard implements IAuthGuard {
  private readonly jwtStrategy;
  constructor(jwtStrategy: JwtStrategy);
  /**
   * Verifica se a requisição possui um token JWT válido
   * @param context - Contexto da requisição HTTP
   * @returns true se autenticado, false caso contrário
   */
  canActivate(context: HttpContext): Promise<boolean>;
  /**
   * Extrai o token JWT do header Authorization
   * @param context - Contexto da requisição
   * @returns Token JWT ou null
   */
  private extractTokenFromHeader;
}
//# sourceMappingURL=jwt-auth.guard.d.ts.map
