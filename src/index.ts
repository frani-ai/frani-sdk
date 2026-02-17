import { HttpServer } from "@core/http";
import { AppModule } from "./modules/app.module";

async function main() {
  const app = new HttpServer(3000);
  app.registerModule(AppModule);
  app.listen();
}

main();
