import { BadGatewayException } from "../../core/http";
import { Controller, Get } from "../../core/http/http-decorator";
import { Logger } from "../logger/logger.service";

@Controller("health")
export class HealthController {
  constructor(private readonly logger: Logger) {}

  @Get("/")
  index() {
    this.logger.log("rota health");
    return "ok";
  }

  @Get("/test")
  error() {
    throw new BadGatewayException("error 400");
  }
}
