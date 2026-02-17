import { Injectable } from "../../core/di/container-decorator";
import { ILogger } from "./interfaces/logger";

@Injectable()
export class Logger implements ILogger {
  log(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ) {
    this.meta("log", description, context);
  }

  warn(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ) {
    this.meta("warn", description, context);
  }

  debug(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ) {
    this.meta("debug", description, context);
  }

  error(
    description: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ) {
    this.meta("error", description, context);
  }

  private meta(
    level: "log" | "debug" | "error" | "warn",
    message: string | Record<string, unknown>,
    context?: Record<string, unknown>,
  ) {
    const loggerAttributes = {
      dateTime: new Date().toISOString(),
      level,
      context,
      message,
      environment: process.env.NODE_ENV,
    };
    console[level](loggerAttributes);
  }
}
