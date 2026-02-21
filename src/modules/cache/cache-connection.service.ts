import Redis from "ioredis";
import { ICacheModuleOptions } from "./interfaces/cache.interface";

export class CacheConnectionService {
  private options: ICacheModuleOptions;
  private _client: Redis | null = null;

  constructor(options: ICacheModuleOptions) {
    this.options = options;
  }

  /**
   * Conecta ao Redis e retorna o cliente.
   * Se já estiver conectado, retorna o cliente existente.
   */
  async connect(): Promise<Redis> {
    if (this._client) {
      return this._client;
    }
    if (this.options.url) {
      this._client = this.options.options
        ? new Redis(this.options.url, this.options.options)
        : new Redis(this.options.url);
    } else if (this.options.options) {
      this._client = new Redis(this.options.options);
    } else {
      this._client = new Redis();
    }
    return this._client;
  }

  /**
   * Retorna o cliente Redis atual (ou null se ainda não conectado).
   */
  getClient(): Redis | null {
    return this._client;
  }

  /**
   * Desconecta do Redis.
   */
  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.quit();
      this._client = null;
    }
  }
}
