import { CacheConnectionService } from "./cache-connection.service";
import { CacheTime } from "./cache-time.constants";

export { CacheTime } from "./cache-time.constants";

export class CacheService {
  constructor(private readonly connection: CacheConnectionService) {}

  private async getClient() {
    return this.connection.connect();
  }

  /**
   * Obtém um valor do cache. Valores armazenados como JSON são parseados.
   * @param key Chave
   * @returns Valor ou null se não existir
   */
  async get<T = string>(key: string): Promise<T | null> {
    const client = await this.getClient();
    const value = await client.get(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  /**
   * Armazena um valor no cache.
   * @param key Chave
   * @param value Valor (será serializado com JSON.stringify, exceto string)
   * @param ttlSeconds TTL em segundos (opcional). Use CacheTime.ONE_MINUTE, ONE_HOUR, etc.
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const client = await this.getClient();
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds !== undefined && ttlSeconds > 0) {
      await client.set(key, serialized, "EX", ttlSeconds);
    } else {
      await client.set(key, serialized);
    }
  }

  /**
   * Remove uma chave do cache.
   */
  async del(key: string): Promise<void> {
    const client = await this.getClient();
    await client.del(key);
  }

  /**
   * Remove várias chaves do cache.
   * @param keys Lista de chaves
   */
  async delMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    const client = await this.getClient();
    await client.del(...keys);
  }
}
