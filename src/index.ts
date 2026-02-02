import "reflect-metadata"
import { HttpServer } from "./core/http/http-server";
import { AppModule } from "./modules/app.module";


async function main() {
  console.log("Frani SDK")

  const app = new HttpServer(3000);
  app.registerModule(AppModule)
  app.listen();
}

main()