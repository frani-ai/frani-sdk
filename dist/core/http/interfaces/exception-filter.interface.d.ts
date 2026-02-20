import { IncomingMessage, ServerResponse } from "http";
import { HttpException } from "../exceptions/http-exception";
export interface HttpContext {
  /** Requisição HTTP (Node.js IncomingMessage) */
  request: IncomingMessage;
  /** Resposta HTTP (Node.js ServerResponse) */
  response: ServerResponse;
  /** Corpo da requisição parseado (ex: JSON) */
  body?: any;
  /** Parâmetros de path extraídos de rotas com :param (ex: /users/:id → params.id) */
  params?: Record<string, string>;
  /** Query string parseada (ex: ?foo=bar → query.foo) */
  query?: Record<string, string | string[]>;
  /** Headers da requisição (atalho para request.headers) */
  headers?: IncomingMessage["headers"];
  /** Método HTTP (GET, POST, PUT, PATCH, DELETE, etc.) */
  method?: string;
  /** URL completa da requisição (ex: /auth/validate/123?token=xyz) */
  url?: string;
  /** Pathname sem query string (ex: /auth/validate/123) */
  pathname?: string;
  /** Usuário autenticado (preenchido por guards, ex: JwtAuthGuard) */
  user?: Record<string, unknown>;
}
export interface IExceptionFilter {
  /**
   * Method called when an exception is caught
   * @param exception - The exception that was thrown
   * @param context - The HTTP context containing request and response
   */
  catch(exception: HttpException, context: HttpContext): void | Promise<void>;
}
//# sourceMappingURL=exception-filter.interface.d.ts.map
