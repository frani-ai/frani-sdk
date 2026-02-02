import { Module } from "../../core/di/container-decorator";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController]
})
export class HealthModule {}