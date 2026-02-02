import { Controller, Get } from "../../core/http/http-decorator";

@Controller("health")
export class HealthController {

  @Get("/")
  index() {
    return "ok";
  }
}