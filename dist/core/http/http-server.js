"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
require("reflect-metadata");
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const package_ref_1 = require("../package-ref");
const http_router_1 = require("./http-router");
const banner_1 = require("../banner");
const metadata_1 = require("../metadata");
const container_1 = require("../di/container");
const version_control_1 = require("../version-control");
class HttpServer {
  constructor(port = 3000) {
    this.port = port;
    this.router = new http_router_1.Router();
    (0, banner_1.printBanner)(this.port);
  }
  /**
   * Set a global interceptor that will be applied to all routes
   * @param interceptorClass - The interceptor class that implements IInterceptor
   */
  setGlobalInterceptor(interceptorClass) {
    this.globalInterceptor = new interceptorClass();
    this.router.setGlobalInterceptor(this.globalInterceptor);
  }
  /**
   * Set a global exception filter that will handle all uncaught exceptions
   * @param filterClass - The filter class that implements IExceptionFilter
   */
  setGlobalExceptionFilter(filterClass) {
    this.globalExceptionFilter = new filterClass();
    this.router.setGlobalExceptionFilter(this.globalExceptionFilter);
  }
  registerController(controllerInstance) {
    this.router.registerController(controllerInstance);
  }
  async listen() {
    const versionControlUrl = process.env["FRANI_VERSION_CONTROL_URL"];
    const result = await (0, version_control_1.runVersionCheck)(
      (0, package_ref_1.getPackageRef)().version,
      versionControlUrl,
    );
    (0, version_control_1.applyVersionCheckResult)(result);
    const server = http_1.default.createServer(async (request, response) => {
      const httpResponse = await this.router.handle(request, response);
      if (!httpResponse) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            statusCode: 404,
            error: "Not Found",
            message: `Not Found path: ${request.url} method: ${request.method}`,
            dateTime: new Date().toISOString(),
          }),
        );
      }
    });
    server.listen(this.port);
  }
  registerModule(moduleClass) {
    const meta = (0, metadata_1.getMetadata)(moduleClass);
    if (!meta) return;
    console.log(`\n📦 Registering module: ${moduleClass.name}`);
    if (meta.providers && meta.providers.length > 0) {
      console.log(
        `   ├─ Providers: ${meta.providers.map((p) => p.name).join(", ")}`,
      );
    }
    meta.providers?.forEach((provider) => {
      const instance = container_1.Container.resolve(provider);
      container_1.Container.register(provider, instance);
    });
    if (meta.controllers && meta.controllers.length > 0) {
      console.log(
        `   ├─ Controllers: ${meta.controllers.map((c) => c.name).join(", ")}`,
      );
    }
    meta.controllers?.forEach((ctrl) => {
      const instance = container_1.Container.resolve(ctrl);
      this.router.registerController(instance);
    });
    if (meta.imports && meta.imports.length > 0) {
      console.log(
        `   └─ Imports: ${meta.imports.map((m) => m.name).join(", ")}`,
      );
      meta.imports?.forEach((mod) => this.registerModule(mod));
    }
  }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=http-server.js.map
