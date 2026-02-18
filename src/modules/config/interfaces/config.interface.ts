export interface IConfigService {
  /**
   * Obtém um valor de configuração
   * @param key - Chave da configuração
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
}

export interface IConfigModuleOptions {
  /**
   * Se true, carrega variáveis de ambiente do arquivo .env
   */
  isGlobal?: boolean;

  /**
   * Caminho para o arquivo .env (padrão: .env)
   */
  envFilePath?: string;

  /**
   * Se true, ignora erros se o arquivo .env não existir
   */
  ignoreEnvFile?: boolean;

  /**
   * Validação de schema das configurações
   */
  validationSchema?: any;

  /**
   * Configurações estáticas a serem carregadas
   */
  load?: Array<() => Record<string, any>>;
}

export interface IDynamicModule {
  module: any;
  providers?: any[];
  controllers?: any[];
  imports?: any[];
  exports?: any[];
}
