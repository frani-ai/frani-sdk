import { Injectable } from "@core/di/container-decorator";
import { IAuthGuard } from "../interfaces/auth.interface";
import { HttpContext } from "@core/http/interfaces/exception-filter.interface";
import { ForbiddenException, UnauthorizedException } from "@core/http";

@Injectable()
export class RolesGuard implements IAuthGuard {
  private requiredRoles: string[] = [];

  /**
   * Define as roles necessárias para acessar a rota
   * @param roles - Array de roles necessárias
   */
  setRequiredRoles(roles: string[]): void {
    this.requiredRoles = roles;
  }

  /**
   * Verifica se o usuário possui as roles necessárias
   * @param context - Contexto da requisição HTTP
   * @returns true se autorizado, false caso contrário
   */
  async canActivate(context: HttpContext): Promise<boolean> {
    const user = (context as any).user;

    if (!user) {
      throw new UnauthorizedException("Usuário não autenticado");
    }

    if (!this.requiredRoles || this.requiredRoles.length === 0) {
      return true;
    }

    const userRoles = user.roles || [];

    const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        "Usuário não possui permissão para acessar este recurso",
      );
    }

    return true;
  }

  /**
   * Cria uma nova instância do guard com roles específicas
   * @param roles - Array de roles necessárias
   * @returns Nova instância do RolesGuard
   */
  static forRoles(roles: string[]): RolesGuard {
    const guard = new RolesGuard();
    guard.setRequiredRoles(roles);
    return guard;
  }
}
