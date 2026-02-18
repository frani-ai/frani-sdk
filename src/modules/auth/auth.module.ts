import { Module } from "@core/di/container-decorator";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OAuthStrategy } from "./strategies/oauth.strategy";
import { OpenIDStrategy } from "./strategies/openid.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [LoggerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    OAuthStrategy,
    OpenIDStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
