import { Module } from "../../core/di/container-decorator";
import { Logger } from "./logger.service";

@Module({
  providers: [Logger],
})
export class LoggerModule {}
