"use strict";
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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientService = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
const axios_1 = __importDefault(require("axios"));
let HttpClientService = class HttpClientService {
  constructor(options) {
    this.client = axios_1.default.create({
      baseURL: options?.baseURL ?? "",
      timeout: options?.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }
  get(url, config) {
    return this.client.get(url, config);
  }
  post(url, data, config) {
    return this.client.post(url, data, config);
  }
  put(url, data, config) {
    return this.client.put(url, data, config);
  }
  patch(url, data, config) {
    return this.client.patch(url, data, config);
  }
  delete(url, config) {
    return this.client.delete(url, config);
  }
  request(config) {
    return this.client.request(config);
  }
  /**
   * Retorna a instância do Axios para uso avançado (interceptors, etc.)
   */
  getInstance() {
    return this.client;
  }
};
exports.HttpClientService = HttpClientService;
exports.HttpClientService = HttpClientService = __decorate(
  [
    (0, container_decorator_1.Injectable)(),
    __metadata("design:paramtypes", [Object]),
  ],
  HttpClientService,
);
//# sourceMappingURL=http-client.service.js.map
