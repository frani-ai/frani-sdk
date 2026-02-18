import { Injectable } from "@core/di/container-decorator";
import {
  OAuthUserResolver,
  OpenIDUserResolver,
} from "./interfaces/auth.interface";

/**
 * Configuração do AuthModule (callbacks OAuth/OpenID).
 * Registrada pelo forRoot/forRootAsync para o controller usar.
 */
@Injectable()
export class AuthModuleConfig {
  constructor(
    public readonly onOAuthCallback?: OAuthUserResolver,
    public readonly onOpenIDCallback?: OpenIDUserResolver,
  ) {}
}
