import { HttpServer } from "@core/http";
import { AuthModule, JwtAuthGuard, RolesGuard } from "../src/modules/auth";
import { Controller, Get, Post } from "@core/http/http-decorator";
import { Injectable } from "@core/di/container-decorator";
import { HttpContext } from "@core/http/interfaces/exception-filter.interface";
import { Module } from "@core/di/container-decorator";

/**
 * Exemplo de uso do módulo de autenticação
 */

// ============================================
// 1. Controller protegido com autenticação JWT
// ============================================

@Controller("users")
class UserController {
  @Get("/")
  async list(context: HttpContext) {
    // Este endpoint está protegido pelo JwtAuthGuard
    // O usuário autenticado está disponível em context.user
    const user = (context as any).user;

    return {
      message: "Lista de usuários",
      authenticatedUser: user,
    };
  }

  @Get("/profile")
  async profile(context: HttpContext) {
    const user = (context as any).user;

    return {
      message: "Perfil do usuário",
      user,
    };
  }

  @Get("/admin")
  async adminOnly(context: HttpContext) {
    // Este endpoint requer a role 'admin'
    const user = (context as any).user;

    return {
      message: "Área administrativa",
      user,
    };
  }
}

@Module({
  controllers: [UserController],
})
class UserModule {}

// ============================================
// 2. Configuração do servidor com autenticação
// ============================================

async function main() {
  const app = new HttpServer(3000);

  // Registrar módulos
  app.registerModule(AuthModule);
  app.registerModule(UserModule);

  // Opcional: Configurar guard global de autenticação
  // app.setGlobalInterceptor(JwtAuthGuard);

  app.listen();

  console.log("\n🔐 Servidor com autenticação iniciado!");
  console.log("\n📝 Endpoints disponíveis:");
  console.log("   POST   /auth/login              - Login com credenciais");
  console.log("   POST   /auth/refresh            - Atualizar token");
  console.log("   GET    /auth/oauth/authorize    - Obter URL OAuth");
  console.log("   GET    /auth/oauth/callback     - Callback OAuth");
  console.log("   GET    /auth/openid/authorize   - Obter URL OpenID");
  console.log("   GET    /auth/openid/callback    - Callback OpenID");
  console.log("   GET    /auth/validate           - Validar token");
  console.log("   GET    /auth/me                 - Dados do usuário");
  console.log(
    "   GET    /users                   - Lista de usuários (protegido)",
  );
  console.log("   GET    /users/profile           - Perfil (protegido)");
  console.log("   GET    /users/admin             - Admin (protegido + role)");
}

// ============================================
// 3. Exemplo de uso do AuthService diretamente
// ============================================

/**
 * Exemplo de uso do AuthService em um serviço customizado
 */
@Injectable()
class CustomAuthService {
  constructor(private readonly authService: any) {}

  async registerUser(email: string, password: string) {
    // Hash da senha
    const hashedPassword = await this.authService.hashPassword(password);

    // Salvar usuário no banco de dados (exemplo)
    const user = {
      id: "123",
      email,
      password: hashedPassword,
    };

    // Retornar tokens
    return this.authService["jwtStrategy"].generateTokenPair(user);
  }

  async validateUser(email: string, password: string) {
    // Buscar usuário no banco de dados (exemplo)
    const user = {
      id: "123",
      email: "user@example.com",
      password: "$2b$10$...",
    };

    // Validar senha
    const isValid = await this.authService.comparePassword(
      password,
      user.password,
    );

    if (!isValid) {
      return null;
    }

    return user;
  }
}

// ============================================
// 4. Configuração de variáveis de ambiente
// ============================================

/**
 * Adicione estas variáveis ao seu arquivo .env:
 *
 * # JWT
 * JWT_SECRET=seu-secret-super-secreto
 * JWT_EXPIRES_IN=1h
 *
 * # OAuth (exemplo: Google)
 * OAUTH_CLIENT_ID=seu-client-id
 * OAUTH_CLIENT_SECRET=seu-client-secret
 * OAUTH_REDIRECT_URI=http://localhost:3000/auth/oauth/callback
 * OAUTH_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
 * OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
 * OAUTH_USER_INFO_URL=https://www.googleapis.com/oauth2/v2/userinfo
 * OAUTH_SCOPE=openid profile email
 *
 * # OpenID Connect (exemplo: Auth0)
 * OPENID_CLIENT_ID=seu-client-id
 * OPENID_CLIENT_SECRET=seu-client-secret
 * OPENID_REDIRECT_URI=http://localhost:3000/auth/openid/callback
 * OPENID_DISCOVERY_URL=https://seu-dominio.auth0.com/.well-known/openid-configuration
 * OPENID_ISSUER=https://seu-dominio.auth0.com/
 * OPENID_SCOPE=openid profile email
 */

// ============================================
// 5. Exemplo de requisições
// ============================================

/**
 * # Login com credenciais
 * curl -X POST http://localhost:3000/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"user@example.com","password":"senha123"}'
 *
 * # Validar token
 * curl http://localhost:3000/auth/validate \
 *   -H "Authorization: Bearer seu-token-jwt"
 *
 * # Atualizar token
 * curl -X POST http://localhost:3000/auth/refresh \
 *   -H "Content-Type: application/json" \
 *   -d '{"refreshToken":"seu-refresh-token"}'
 *
 * # Acessar endpoint protegido
 * curl http://localhost:3000/users \
 *   -H "Authorization: Bearer seu-token-jwt"
 *
 * # Obter URL de autorização OAuth
 * curl http://localhost:3000/auth/oauth/authorize
 *
 * # Obter URL de autorização OpenID
 * curl http://localhost:3000/auth/openid/authorize
 */

// Descomentar para executar
// main();
