import { IAuthGuard } from "../interfaces/auth.interface";
import { HttpContext } from "../../../core/http/interfaces/exception-filter.interface";
export declare class RolesGuard implements IAuthGuard {
  private requiredRoles;
  /**
   * Define as roles necessárias para acessar a rota
   * @param roles - Array de roles necessárias
   */
  setRequiredRoles(roles: string[]): void;
  /**
   * Verifica se o usuário possui as roles necessárias
   * @param context - Contexto da requisição HTTP
   * @returns true se autorizado, false caso contrário
   */
  canActivate(context: HttpContext): Promise<boolean>;
  /**
   * Cria uma nova instância do guard com roles específicas
   * @param roles - Array de roles necessárias
   * @returns Nova instância do RolesGuard
   */
  static forRoles(roles: string[]): RolesGuard;
}
//# sourceMappingURL=roles.guard.d.ts.map
