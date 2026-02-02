import { Container } from "../di/container";
import { getMetadata } from "../metadata";
import { Router } from "./http-router";
import http, { IncomingMessage, ServerResponse } from "http";

export class HttpServer {

  private port: number;
  private router: Router;

  constructor(port = 3000) {
    this.port = port;
    this.router = new Router();
  }

  registerController(controllerInstance: Function) {
    this.router.registerController(controllerInstance);
  }

  async listen() {
    const server = http.createServer(async (request: any, response: any) => {
      const httpResponse = await this.router.handle(request, response);
      if (!response) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Not Found" }));
      }
    });

    server.listen(this.port, () =>
      console.log(`🚀 Server running at http://localhost:${this.port}`)
    );
  }

  registerModule(moduleClass: any) {
    const meta = getMetadata(moduleClass);
    if (!meta) return;

    console.log(`\n📦 Registering module: ${moduleClass.name}`);

    if (meta.providers && meta.providers.length > 0) {
      console.log(`   ├─ Providers: ${meta.providers.map((p: any) => p.name).join(', ')}`);
    }

    meta.providers?.forEach((provider: any) => {
      const instance = Container.resolve(provider);
      Container.register(provider, instance);
    });

    if (meta.controllers && meta.controllers.length > 0) {
      console.log(`   ├─ Controllers: ${meta.controllers.map((c: any) => c.name).join(', ')}`);
    }

    meta.controllers?.forEach((ctrl: any) => {
      const instance = Container.resolve(ctrl);
      this.router.registerController(instance);
    });

    if (meta.imports && meta.imports.length > 0) {
      console.log(`   └─ Imports: ${meta.imports.map((m: any) => m.name).join(', ')}`);
      meta.imports?.forEach((mod: any) => this.registerModule(mod));
    }
  }
}