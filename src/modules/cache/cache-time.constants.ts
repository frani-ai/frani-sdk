/**
 * Constantes de tempo em segundos para TTL no Redis.
 * Uso: CacheTime.ONE_MINUTE, CacheTime.ONE_DAY, etc.
 */
export const CacheTime = {
  ONE_MINUTE: 60,
  ONE_HOUR: 60 * 60,
  ONE_DAY: 24 * 60 * 60,
  ONE_MONTH: 30 * 24 * 60 * 60,
} as const;

export type CacheTimeKey = keyof typeof CacheTime;
