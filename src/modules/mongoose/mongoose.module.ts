import { model as createModel } from "mongoose";
import { MongooseConnectionService } from "./mongoose-connection.service";
import {
  getModelToken,
  IDynamicModule,
  IMongooseModuleOptions,
  isSchemaDefinition,
  MongooseFeatureDefinition,
} from "./interfaces/mongoose.interface";
import { Container, Module } from "@core/index";
import { ConfigService } from "../config";

@Module({
  providers: [],
})
export class MongooseModule {
  /**
   * Registra o módulo com opções estáticas (uri e opções de conexão).
   */
  static forRoot(
    options?: IMongooseModuleOptions,
  ): typeof MongooseModule & { __dynamic: IDynamicModule } {
    const opts = options ?? { uri: "" };
    const service = new MongooseConnectionService(opts);
    Container.register(MongooseConnectionService, service);

    const dynamicModule = MongooseModule as typeof MongooseModule & {
      __dynamic: IDynamicModule;
    };
    dynamicModule.__dynamic = {
      module: MongooseModule,
      providers: [MongooseConnectionService],
      exports: [MongooseConnectionService],
    };
    return dynamicModule;
  }

  /**
   * Registra o módulo usando ConfigService (variáveis de ambiente).
   * Variáveis: MONGODB_URI (obrigatório), MONGODB_OPTIONS (JSON opcional)
   */
  static forRootAsync(options?: {
    useFactory?: (
      config: ConfigService,
      ...args: any[]
    ) => IMongooseModuleOptions;
    inject?: any[];
  }): typeof MongooseModule & { __dynamic: IDynamicModule } {
    const configService = Container.resolve(ConfigService);

    let opts: IMongooseModuleOptions;
    if (options?.useFactory) {
      const deps = (options.inject ?? []).map((d) => Container.resolve(d));
      opts = options.useFactory(configService, ...deps);
    } else {
      const uri = configService.get("MONGODB_URI", "");
      let connectionOptions: IMongooseModuleOptions["options"] = undefined;
      const optionsStr = configService.get<string>("MONGODB_OPTIONS");
      if (optionsStr) {
        try {
          const parsed = JSON.parse(optionsStr);
          if (typeof parsed === "object" && parsed !== null) {
            connectionOptions = parsed;
          }
        } catch (_) {
          // ignorar JSON inválido
        }
      }
      opts =
        connectionOptions !== undefined
          ? { uri, options: connectionOptions }
          : { uri };
    }

    return MongooseModule.forRoot(opts);
  }

  /**
   * Registra modelos/schemas para injeção nos services.
   * Aceita: Model já criado (ex: UserModel) ou { name, schema }.
   *
   * Uso com Model: forFeature([UserModel, ProfileModel])
   * Uso com schema: forFeature([{ name: 'User', schema: UserSchema }])
   *   → injetar com Container.resolve(getModelToken('User'))
   */
  static forFeature(
    features: MongooseFeatureDefinition[],
  ): typeof MongooseModule & { __dynamic: IDynamicModule } {
    const providers: any[] = [];

    for (const def of features) {
      if (isSchemaDefinition(def)) {
        const modelInstance = createModel(def.name, def.schema);
        const token = getModelToken(def.name);
        Container.register(token, modelInstance);
        providers.push({ provide: token, useValue: modelInstance });
      } else {
        Container.register(def, def);
        providers.push(def);
      }
    }

    const dynamicModule = MongooseModule as typeof MongooseModule & {
      __dynamic: IDynamicModule;
    };
    dynamicModule.__dynamic = {
      module: MongooseModule,
      providers,
      exports: providers,
    };
    return dynamicModule;
  }
}
