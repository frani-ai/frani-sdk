/** Interface mínima compatível com schemas Zod (qualquer versão) para evitar conflito de tipos entre pacotes. */
export interface ZodLikeSchema<T = unknown> {
  safeParse(data: unknown):
    | {
        success: true;
        data: T;
      }
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
export declare function validateDTO<T>(
  body: unknown,
  schema: ZodLikeSchema<T>,
): T;
//# sourceMappingURL=validate-dto.d.ts.map
