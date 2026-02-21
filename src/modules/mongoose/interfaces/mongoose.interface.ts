import type { ConnectOptions, Model, Schema } from "mongoose";

export interface IMongooseModuleOptions {
  uri: string;
  options?: ConnectOptions;
}

/** Usado pelo container para módulos dinâmicos (forRoot / forRootAsync). */
export interface IDynamicModule {
  module: any;
  providers: any[];
  exports: any[];
}

/** Definição por nome + schema (o modelo é criado pelo forFeature). */
export interface IMongooseFeatureSchema {
  name: string;
  schema: Schema;
}

/** Aceita Model já criado ou { name, schema } para criar o modelo. */
export type MongooseFeatureDefinition = Model<unknown> | IMongooseFeatureSchema;

const MODEL_TOKENS = new Map<string, symbol>();

/**
 * Token para injetar um modelo registrado via forFeature({ name, schema }).
 * Use no construtor: @Inject(getModelToken('User')) private userModel: Model<IUser>
 * ou no Container: Container.resolve(getModelToken('User'))
 */
export function getModelToken(modelName: string): symbol {
  let token = MODEL_TOKENS.get(modelName);
  if (!token) {
    token = Symbol(`MONGOOSE_MODEL:${modelName}`);
    MODEL_TOKENS.set(modelName, token);
  }
  return token;
}

/** Type guard para definição { name, schema }. */
export function isSchemaDefinition(
  def: MongooseFeatureDefinition,
): def is IMongooseFeatureSchema {
  return (
    typeof def === "object" &&
    def !== null &&
    "name" in def &&
    "schema" in def &&
    typeof (def as IMongooseFeatureSchema).name === "string"
  );
}
