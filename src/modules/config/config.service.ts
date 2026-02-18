import { Injectable } from "@core/di/container-decorator";
import { IConfigService } from "./interfaces/config.interface";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ConfigService implements IConfigService {
  private config: Map<string, any> = new Map();

  constructor(options?: { envFilePath?: string; ignoreEnvFile?: boolean }) {
    this.loadEnvironmentVariables(options);
  }

  /**
   * Obtém um valor de configuração
   * @param key - Chave da configuração (suporta notação de ponto: 'database.host')
   * @param defaultValue - Valor padrão se a chave não existir
   */
  get<T = any>(key: string, defaultValue?: T): T {
    // Verificar primeiro no Map de configurações customizadas
    if (this.config.has(key)) {
      return this.config.get(key) as T;
    }

    // Verificar em process.env
    const envValue = process.env[key];
    if (envValue !== undefined) {
      return this.parseValue(envValue) as T;
    }

    // Suportar notação de ponto (ex: 'database.host')
    if (key.includes(".")) {
      const value = this.getNestedValue(key);
      if (value !== undefined) {
        return value as T;
      }
    }

    return defaultValue as T;
  }

  /**
   * Define um valor de configuração
   * @param key - Chave da configuração
   * @param value - Valor a ser definido
   */
  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  /**
   * Verifica se uma chave existe
   * @param key - Chave da configuração
   */
  has(key: string): boolean {
    return this.config.has(key) || process.env[key] !== undefined;
  }

  /**
   * Obtém todas as configurações
   */
  getAll(): Record<string, any> {
    const all: Record<string, any> = { ...process.env };

    this.config.forEach((value, key) => {
      all[key] = value;
    });

    return all;
  }

  /**
   * Carrega configurações de um objeto
   * @param config - Objeto com configurações
   */
  load(config: Record<string, any>): void {
    Object.entries(config).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Obtém configuração tipada
   * @param key - Chave da configuração
   */
  getString(key: string, defaultValue?: string): string {
    return this.get<string>(key, defaultValue);
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key, defaultValue);
    return typeof value === "number" ? value : Number(value);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key, defaultValue);
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return (value as string).toLowerCase() === "true" || value === "1";
    }
    return Boolean(value);
  }

  getArray(key: string, defaultValue?: any[]): any[] {
    const value = this.get(key, defaultValue);
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return (value as string).split(",").map((v: string) => v.trim());
    }
    return defaultValue || [];
  }

  /**
   * Carrega variáveis de ambiente do arquivo .env
   */
  private loadEnvironmentVariables(options?: {
    envFilePath?: string;
    ignoreEnvFile?: boolean;
  }): void {
    if (options?.ignoreEnvFile) {
      return;
    }

    const envPath = options?.envFilePath || ".env";
    const fullPath = path.resolve(process.cwd(), envPath);

    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath });
    }
  }

  /**
   * Obtém valor aninhado usando notação de ponto
   * @param key - Chave com notação de ponto (ex: 'database.host')
   */
  private getNestedValue(key: string): any {
    const keys = key.split(".");
    let value: any = this.config;

    for (const k of keys) {
      if (value instanceof Map) {
        value = value.get(k);
      } else if (typeof value === "object" && value !== null) {
        value = value[k];
      } else {
        return undefined;
      }

      if (value === undefined) {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Converte string para tipo apropriado
   */
  private parseValue(value: string): any {
    // Boolean
    if (value === "true") return true;
    if (value === "false") return false;

    // Number
    if (!isNaN(Number(value)) && value !== "") {
      return Number(value);
    }

    // String
    return value;
  }
}
