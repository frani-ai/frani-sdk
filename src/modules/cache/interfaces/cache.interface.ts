import type { RedisOptions } from "ioredis";

export interface ICacheModuleOptions {
  /** URL de conexão (ex: redis://localhost:6379) ou opções do Redis. */
  url?: string;
  /** Opções do cliente ioredis (usado quando url não é suficiente). */
  options?: RedisOptions;
}
