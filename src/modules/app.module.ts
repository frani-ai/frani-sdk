import { Module } from "../core/di/container-decorator";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [HealthModule]
})
export class AppModule {}