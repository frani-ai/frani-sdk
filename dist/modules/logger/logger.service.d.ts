import { ILogger } from "./interfaces/logger";
export declare class Logger implements ILogger {
  log(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ): void;
  warn(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ): void;
  debug(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ): void;
  error(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ): void;
  private meta;
}
//# sourceMappingURL=logger.service.d.ts.map
