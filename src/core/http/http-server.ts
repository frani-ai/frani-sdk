import "reflect-metadata";
import "dotenv/config";
import http from "http";
import { Router } from "./http-router";
import { IInterceptor } from "./interfaces/interceptor.interface";
import { IExceptionFilter } from "./interfaces/exception-filter.interface";
import { printBanner } from "@core/banner";
import { getMetadata } from "@core/metadata";
import { Container } from "@core/di/container";

export class HttpServer {
  private port: number;
  private router: Router;
  private globalInterceptor?: IInterceptor;
  private globalExceptionFilter?: IExceptionFilter;

  constructor(port = 3000) {
    this.port = port;
    this.router = new Router();
    printBanner(this.port);
  }

  /**
   * Set a global interceptor that will be applied to all routes
   * @param interceptorClass - The interceptor class that implements IInterceptor
   */
  setGlobalInterceptor(interceptorClass: new () => IInterceptor) {
    this.globalInterceptor = new interceptorClass();
    this.router.setGlobalInterceptor(this.globalInterceptor);
  }

  /**
   * Set a global exception filter that will handle all uncaught exceptions
   * @param filterClass - The filter class that implements IExceptionFilter
   */
  setGlobalExceptionFilter(filterClass: new () => IExceptionFilter) {
    this.globalExceptionFilter = new filterClass();
    this.router.setGlobalExceptionFilter(this.globalExceptionFilter);
  }

  registerController(controllerInstance: Function) {
    this.router.registerController(controllerInstance);
  }

  async listen() {
    const server = http.createServer(async (request: any, response: any) => {
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

  registerModule(moduleClass: any) {
    const meta = getMetadata(moduleClass);
    if (!meta) return;

    console.log(`\n📦 Registering module: ${moduleClass.name}`);

    if (meta.providers && meta.providers.length > 0) {
      console.log(
        `   ├─ Providers: ${meta.providers.map((p: any) => p.name).join(", ")}`,
      );
    }

    meta.providers?.forEach((provider: any) => {
      const instance = Container.resolve(provider);
      Container.register(provider, instance);
    });

    if (meta.controllers && meta.controllers.length > 0) {
      console.log(
        `   ├─ Controllers: ${meta.controllers.map((c: any) => c.name).join(", ")}`,
      );
    }

    meta.controllers?.forEach((ctrl: any) => {
      const instance = Container.resolve(ctrl);
      this.router.registerController(instance);
    });

    if (meta.imports && meta.imports.length > 0) {
      console.log(
        `   └─ Imports: ${meta.imports.map((m: any) => m.name).join(", ")}`,
      );
      meta.imports?.forEach((mod: any) => this.registerModule(mod));
    }
  }
}
