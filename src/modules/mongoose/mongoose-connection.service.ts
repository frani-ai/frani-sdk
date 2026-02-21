import mongoose from "mongoose";
import { IMongooseModuleOptions } from "./interfaces/mongoose.interface";

export class MongooseConnectionService {
  private options: IMongooseModuleOptions;
  private _connection: typeof mongoose | null = null;

  constructor(options: IMongooseModuleOptions) {
    this.options = options;
  }

  async connect(): Promise<typeof mongoose> {
    if (this._connection) {
      return this._connection;
    }
    this._connection = await mongoose.connect(
      this.options.uri,
      this.options.options,
    );
    return this._connection;
  }

  getConnection(): typeof mongoose | null {
    return this._connection;
  }

  async disconnect(): Promise<void> {
    if (this._connection) {
      await mongoose.disconnect();
      this._connection = null;
    }
  }
}
