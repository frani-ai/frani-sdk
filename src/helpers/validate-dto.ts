import { ValidationException } from "@core/http";

/** Interface mínima compatível com schemas Zod (qualquer versão) para evitar conflito de tipos entre pacotes. */
export interface ZodLikeSchema<T = unknown> {
  safeParse(data: unknown):
    | { success: true; data: T }
    | {
        success: false;
        error: {
          issues: Array<{
            path?: (string | number | symbol)[];
            message: string;
          }>;
        };
      };
}

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
export function validateDTO<T>(body: unknown, schema: ZodLikeSchema<T>): T {
  const result = schema.safeParse(body);

  if (result.success) {
    return result.data;
  }

  const errors = result.error.issues.map((issue) => {
    const path = Array.isArray(issue.path)
      ? (issue.path.filter(
          (p): p is string | number =>
            typeof p === "string" || typeof p === "number",
        ) as (string | number)[])
      : [];
    return { path, message: issue.message };
  });

  const first = errors[0];
  const message =
    errors.length === 1 && first
      ? first.message
      : `Validation failed (${errors.length} error(s))`;

  throw new ValidationException(message, errors);
}
