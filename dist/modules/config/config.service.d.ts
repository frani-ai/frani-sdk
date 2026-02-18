import { IConfigService } from "./interfaces/config.interface";
export declare class ConfigService implements IConfigService {
  private config;
  constructor(options?: { envFilePath?: string; ignoreEnvFile?: boolean });
  /**
   * Obtém um valor de configuração
   * @param key - Chave da configuração (suporta notação de ponto: 'database.host')
   * @param defaultValue - Valor padrão se a chave não existir
   */
  get<T = any>(key: string, defaultValue?: T): T;
  /**
   * Define um valor de configuração
   * @param key - Chave da configuração
   * @param value - Valor a ser definido
   */
  set(key: string, value: any): void;
  /**
   * Verifica se uma chave existe
   * @param key - Chave da configuração
   */
  has(key: string): boolean;
  /**
   * Obtém todas as configurações
   */
  getAll(): Record<string, any>;
  /**
   * Carrega configurações de um objeto
   * @param config - Objeto com configurações
   */
  load(config: Record<string, any>): void;
  /**
   * Obtém configuração tipada
   * @param key - Chave da configuração
   */
  getString(key: string, defaultValue?: string): string;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
  getArray(key: string, defaultValue?: any[]): any[];
  /**
   * Carrega variáveis de ambiente do arquivo .env
   */
  private loadEnvironmentVariables;
  /**
   * Obtém valor aninhado usando notação de ponto
   * @param key - Chave com notação de ponto (ex: 'database.host')
   */
  private getNestedValue;
  /**
   * Converte string para tipo apropriado
   */
  private parseValue;
}
//# sourceMappingURL=config.service.d.ts.map
