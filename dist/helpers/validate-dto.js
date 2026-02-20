"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = validateDTO;
const http_1 = require("../core/http");
/**
 * Valida o body da requisição contra um schema Zod.
 * Retorna os dados tipados em caso de sucesso.
 * Lança ValidationException (422) com a lista de erros em caso de falha.
 *
 * @param body - Dados a validar (ex: context.body)
 * @param schema - Schema Zod (ex: z.object({ email: z.string().email(), password: z.string().min(8) }))
 * @returns Dados parseados e tipados
 * @throws ValidationException com status 422 e detalhes dos erros
 *
 * @example
 * // No backend: definir schema
 * const LoginSchema = z.object({
 *   email: z.string().email('E-mail inválido'),
 *   password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
 * });
 *
 * // No controller
 * const body = validateDTO(context.body, LoginSchema);
 * // body é { email: string; password: string }
 */
function validateDTO(body, schema) {
  const result = schema.safeParse(body);
  if (result.success) {
    return result.data;
  }
  const errors = result.error.issues.map((issue) => {
    const path = Array.isArray(issue.path)
      ? issue.path.filter((p) => typeof p === "string" || typeof p === "number")
      : [];
    return { path, message: issue.message };
  });
  const first = errors[0];
  const message =
    errors.length === 1 && first
      ? first.message
      : `Validation failed (${errors.length} error(s))`;
  throw new http_1.ValidationException(message, errors);
}
//# sourceMappingURL=validate-dto.js.map
