import {
  IConfigModuleOptions,
  IDynamicModule,
} from "./interfaces/config.interface";
export declare class ConfigModule {
  /**
   * Configura o módulo de forma dinâmica (similar ao NestJS)
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRoot(options?: IConfigModuleOptions): typeof ConfigModule & {
    __dynamic: IDynamicModule;
  };
  /**
   * Configura o módulo de forma assíncrona
   * @param options - Opções de configuração
   * @returns Módulo dinâmico configurado
   */
  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<IConfigModuleOptions> | IConfigModuleOptions;
    inject?: any[];
  }): Promise<
    typeof ConfigModule & {
      __dynamic: IDynamicModule;
    }
  >;
}
//# sourceMappingURL=config.module.d.ts.map
