import "reflect-metadata";
import { HttpServer } from "@core/http";
import { Module } from "@core/di/container-decorator";
import { ConfigModule, ConfigService } from "../src/modules/config";
import { AuthModule } from "../src/modules/auth";

/**
 * Exemplo 1: Usando AuthModule.forRoot() com configuração estática
 */

@Module({
  imports: [
    // Configurar AuthModule com opções estáticas
    AuthModule.forRoot({
      jwt: {
        secret: "my-super-secret-key",
        expiresIn: "2h",
        algorithm: "HS256",
      },
      oauth: {
        clientId: "google-client-id",
        clientSecret: "google-client-secret",
        redirectUri: "http://localhost:3000/auth/oauth/callback",
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
        scope: ["openid", "profile", "email"],
      },
    }),
  ],
})
class AppModuleExample1 {}

/**
 * Exemplo 2: Usando ConfigModule e AuthModule.forRootAsync()
 */

@Module({
  imports: [
    // 1. Configurar ConfigModule primeiro
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [
        // Carregar configurações customizadas
        () => ({
          app: {
            name: "AI Reviewer",
            port: 3000,
            environment: "development",
          },
          database: {
            host: "localhost",
            port: 5432,
            name: "ai_reviewer_db",
          },
        }),
      ],
    }),

    // 2. Configurar AuthModule usando ConfigService
    AuthModule.forRootAsync(),
  ],
})
class AppModuleExample2 {}

/**
 * Exemplo 3: Usando ConfigModule.forRoot() com factory customizada
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [
        () => ({
          jwt: {
            secret: process.env.JWT_SECRET || "fallback-secret",
            expiresIn: "1h",
          },
        }),
      ],
    }),

    AuthModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        jwt: {
          secret: configService.get("jwt.secret"),
          expiresIn: configService.get("jwt.expiresIn"),
          algorithm: "HS256",
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
class AppModuleExample3 {}

/**
 * Exemplo 4: Usando ConfigService diretamente em um controller
 */

import { Controller, Get } from "@core/http";

@Controller("config")
class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get("/app-info")
  getAppInfo() {
    return {
      name: this.configService.get("app.name", "Unknown App"),
      port: this.configService.getNumber("app.port", 3000),
      environment: this.configService.getString(
        "app.environment",
        "development",
      ),
      nodeEnv: this.configService.get("NODE_ENV"),
    };
  }

  @Get("/database-config")
  getDatabaseConfig() {
    return {
      host: this.configService.get("database.host"),
      port: this.configService.getNumber("database.port"),
      name: this.configService.get("database.name"),
    };
  }

  @Get("/features")
  getFeatures() {
    return {
      authEnabled: this.configService.getBoolean("FEATURE_AUTH", true),
      debugMode: this.configService.getBoolean("DEBUG_MODE", false),
      allowedOrigins: this.configService.getArray("ALLOWED_ORIGINS", ["*"]),
    };
  }
}

/**
 * Exemplo 5: Aplicação completa
 */

async function main() {
  const app = new HttpServer(3000);

  // Opção 1: Com configuração estática
  // app.registerModule(AppModuleExample1);

  // Opção 2: Com ConfigService (recomendado)
  app.registerModule(AppModuleExample2);

  app.listen();

  console.log("\n🚀 Servidor iniciado com sucesso!");
  console.log("\n📝 Endpoints disponíveis:");
  console.log("   POST   /auth/login              - Login com credenciais");
  console.log("   POST   /auth/refresh            - Atualizar token");
  console.log("   GET    /auth/validate           - Validar token");
  console.log("   GET    /auth/me                 - Dados do usuário");
  console.log("   GET    /config/app-info         - Informações da aplicação");
  console.log("   GET    /config/database-config  - Configuração do banco");
}

/**
 * Exemplo 6: Usando ConfigService em um serviço
 */

import { Injectable } from "@core/di/container-decorator";

@Injectable()
class DatabaseService {
  private connection: any;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  private connect() {
    const host = this.configService.get("database.host", "localhost");
    const port = this.configService.getNumber("database.port", 5432);
    const database = this.configService.get("database.name", "mydb");
    const user = this.configService.get("DB_USER", "postgres");
    const password = this.configService.get("DB_PASSWORD", "");

    console.log(`Conectando ao banco: ${user}@${host}:${port}/${database}`);
    // Implementar conexão real aqui
  }
}

/**
 * Exemplo 7: Arquivo .env
 */

/**
 * Crie um arquivo .env na raiz do projeto:
 *
 * # Node Environment
 * NODE_ENV=development
 *
 * # Server
 * PORT=3000
 *
 * # JWT
 * JWT_SECRET=seu-secret-super-secreto
 * JWT_EXPIRES_IN=1h
 * JWT_ALGORITHM=HS256
 *
 * # OAuth (Google)
 * OAUTH_CLIENT_ID=seu-client-id
 * OAUTH_CLIENT_SECRET=seu-client-secret
 * OAUTH_REDIRECT_URI=http://localhost:3000/auth/oauth/callback
 * OAUTH_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
 * OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
 * OAUTH_USER_INFO_URL=https://www.googleapis.com/oauth2/v2/userinfo
 * OAUTH_SCOPE=openid,profile,email
 *
 * # OpenID Connect (Auth0)
 * OPENID_CLIENT_ID=seu-client-id
 * OPENID_CLIENT_SECRET=seu-client-secret
 * OPENID_REDIRECT_URI=http://localhost:3000/auth/openid/callback
 * OPENID_DISCOVERY_URL=https://seu-dominio.auth0.com/.well-known/openid-configuration
 * OPENID_ISSUER=https://seu-dominio.auth0.com/
 * OPENID_SCOPE=openid,profile,email
 *
 * # Database
 * DB_HOST=localhost
 * DB_PORT=5432
 * DB_NAME=ai_reviewer
 * DB_USER=postgres
 * DB_PASSWORD=password
 *
 * # Features
 * FEATURE_AUTH=true
 * DEBUG_MODE=false
 * ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
 */

// Descomentar para executar
// main();
