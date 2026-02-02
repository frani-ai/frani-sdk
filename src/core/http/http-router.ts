import url from "url";
import { getMetadata } from "../metadata"
import { IRouter } from "./interfaces/http.interface";
import { IncomingMessage, RequestListener, RequestOptions, ServerResponse } from "http";

export class Router {
  private routes: IRouter[] = []

  registerController(controllerInstance: any) {
    const controllerMeta = getMetadata(controllerInstance.constructor);
    if (!controllerMeta) return;

    const basePath = controllerMeta.basePath || "";

    console.log(`\n🛣️  Mapping routes for ${controllerInstance.constructor.name}:`);

    controllerMeta.routes.forEach((route: IRouter & { handlerName: string }) => {
      // Normalize path: ensure it starts with / and doesn't have double slashes
      const normalizedBasePath = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
      const normalizedRoutePath = route.path.replace(/^\/+|\/+$/g, '');
      const fullPath = normalizedRoutePath ? `${normalizedBasePath}/${normalizedRoutePath}` : normalizedBasePath || '/';

      console.log(`   └─ ${route.method.padEnd(6)} ${fullPath} → ${route.handlerName}()`);

      this.routes.push({
        method: route.method,
        path: fullPath,
        handler: (controllerInstance as any)[route.handlerName].bind(controllerInstance),
      })
    })
  }

  async handle(request: IncomingMessage & { url: string }, response: ServerResponse) {
    const parseUrl = url.parse(request.url, true);
    const route = this.routes.find(route => route.method === request.method && route.path === parseUrl.pathname)

    if (route) {
      let body = "";
      request.on("data", (chunk: unknown) => (body += chunk));
      request.on("end", async () => {
        const json = body ? JSON.parse(body) : {};
        const result = await route.handler({ request, response, body: json });
        if (!response.writableEnded) {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result));
        }
      });
      return true;
    }

    console.log(`❌ Route not found: ${request.method} ${parseUrl.pathname}`);
    return false;
  }
}