"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ConfigService = class ConfigService {
  constructor(options) {
    this.config = new Map();
    this.loadEnvironmentVariables(options);
  }
  /**
   * Obtém um valor de configuração
   * @param key - Chave da configuração (suporta notação de ponto: 'database.host')
   * @param defaultValue - Valor padrão se a chave não existir
   */
  get(key, defaultValue) {
    // Verificar primeiro no Map de configurações customizadas
    if (this.config.has(key)) {
      return this.config.get(key);
    }
    // Verificar em process.env
    const envValue = process.env[key];
    if (envValue !== undefined) {
      return this.parseValue(envValue);
    }
    // Suportar notação de ponto (ex: 'database.host')
    if (key.includes(".")) {
      const value = this.getNestedValue(key);
      if (value !== undefined) {
        return value;
      }
    }
    return defaultValue;
  }
  /**
   * Define um valor de configuração
   * @param key - Chave da configuração
   * @param value - Valor a ser definido
   */
  set(key, value) {
    this.config.set(key, value);
  }
  /**
   * Verifica se uma chave existe
   * @param key - Chave da configuração
   */
  has(key) {
    return this.config.has(key) || process.env[key] !== undefined;
  }
  /**
   * Obtém todas as configurações
   */
  getAll() {
    const all = { ...process.env };
    this.config.forEach((value, key) => {
      all[key] = value;
    });
    return all;
  }
  /**
   * Carrega configurações de um objeto
   * @param config - Objeto com configurações
   */
  load(config) {
    Object.entries(config).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
  /**
   * Obtém configuração tipada
   * @param key - Chave da configuração
   */
  getString(key, defaultValue) {
    return this.get(key, defaultValue);
  }
  getNumber(key, defaultValue) {
    const value = this.get(key, defaultValue);
    return typeof value === "number" ? value : Number(value);
  }
  getBoolean(key, defaultValue) {
    const value = this.get(key, defaultValue);
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1";
    }
    return Boolean(value);
  }
  getArray(key, defaultValue) {
    const value = this.get(key, defaultValue);
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value.split(",").map((v) => v.trim());
    }
    return defaultValue || [];
  }
  /**
   * Carrega variáveis de ambiente do arquivo .env
   */
  loadEnvironmentVariables(options) {
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
  getNestedValue(key) {
    const keys = key.split(".");
    let value = this.config;
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
  parseValue(value) {
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
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [Object]),
  ],
  ConfigService,
);
//# sourceMappingURL=config.service.js.map
