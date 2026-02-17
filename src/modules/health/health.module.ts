import { Module } from "../../core/di/container-decorator";
import { LoggerModule } from "../logger/logger.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [LoggerModule],
  controllers: [HealthController],
})
export class HealthModule {}
