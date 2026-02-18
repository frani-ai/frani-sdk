# 🔐 Módulo de Autenticação - Frani SDK

Módulo completo de autenticação com suporte a **JWT**, **OAuth 2.0** e **OpenID Connect**.

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estratégias de Autenticação](#estratégias-de-autenticação)
  - [JWT](#jwt)
  - [OAuth 2.0](#oauth-20)
  - [OpenID Connect](#openid-connect)
- [Guards](#guards)
- [Uso Básico](#uso-básico)
- [Exemplos](#exemplos)
- [API Reference](#api-reference)

## 🚀 Instalação

As dependências necessárias já estão incluídas:

```bash
npm install jsonwebtoken @types/jsonwebtoken bcrypt @types/bcrypt
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# JWT
JWT_SECRET=seu-secret-super-secreto-mude-em-producao
JWT_EXPIRES_IN=1h

# OAuth 2.0 (exemplo: Google)
OAUTH_CLIENT_ID=seu-client-id
OAUTH_CLIENT_SECRET=seu-client-secret
OAUTH_REDIRECT_URI=http://localhost:3000/auth/oauth/callback
OAUTH_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
OAUTH_USER_INFO_URL=https://www.googleapis.com/oauth2/v2/userinfo
OAUTH_SCOPE=openid profile email

# OpenID Connect (exemplo: Auth0)
OPENID_CLIENT_ID=seu-client-id
OPENID_CLIENT_SECRET=seu-client-secret
OPENID_REDIRECT_URI=http://localhost:3000/auth/openid/callback
OPENID_DISCOVERY_URL=https://seu-dominio.auth0.com/.well-known/openid-configuration
OPENID_ISSUER=https://seu-dominio.auth0.com/
OPENID_SCOPE=openid profile email
```

### Registrar o Módulo

```typescript
import { HttpServer } from "@core/http";
import { AuthModule } from "@modules/auth";

async function main() {
  const app = new HttpServer(3000);
  app.registerModule(AuthModule);
  app.listen();
}

main();
```

## 🎯 Visão geral: SDK abstrato

O módulo de auth do SDK **não faz busca de usuário**. Ele cuida de:

- **Gerar e renovar tokens** – você valida credenciais no seu backend e chama `authService.generateTokenPair(user)`.
- **Validar token** – `GET /auth/validate` e `authService.validateToken(token)`.
- **Refresh** – `POST /auth/refresh` e `authService.refreshAccessToken(refreshToken)`.
- **OAuth/OpenID** – rotas de authorize e callback; no callback você resolve o usuário (ex.: find/create no seu banco) via `onOAuthCallback` / `onOpenIDCallback` e o SDK gera o token.

**Login com email/senha** fica no seu backend: você busca o usuário, compara senha (ex.: com `authService.comparePassword`) e, se ok, chama `authService.generateTokenPair(user)` e devolve os tokens.

## 🔑 Estratégias de Autenticação

### JWT

Autenticação baseada em JSON Web Tokens.

#### Características

- ✅ Stateless
- ✅ Access tokens e refresh tokens
- ✅ Configurável (algoritmo, expiração, issuer)
- ✅ Validação automática

#### Uso

```typescript
import { JwtStrategy } from "@modules/auth";

const jwtStrategy = new JwtStrategy({
  secret: "seu-secret",
  expiresIn: "1h",
  algorithm: "HS256",
});

// Gerar token
const token = jwtStrategy.sign({
  id: "123",
  email: "user@example.com",
  roles: ["user"],
});

// Validar token
const user = await jwtStrategy.validate({ token });

// Gerar par de tokens (access + refresh)
const tokens = jwtStrategy.generateTokenPair(user);
```

### OAuth 2.0

Autenticação usando provedores OAuth (Google, Facebook, GitHub, etc.).

#### Características

- ✅ Integração com provedores externos
- ✅ Authorization Code Flow
- ✅ CSRF protection com state
- ✅ Obtenção automática de user info

#### Uso

```typescript
import { OAuthStrategy } from "@modules/auth";

const oauthStrategy = new OAuthStrategy({
  clientId: "seu-client-id",
  clientSecret: "seu-client-secret",
  redirectUri: "http://localhost:3000/auth/oauth/callback",
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
  scope: ["openid", "profile", "email"],
});

// Obter URL de autorização
const authUrl = oauthStrategy.getAuthorizationUrl("random-state");

// Validar código de autorização
const user = await oauthStrategy.validate({ code: "auth-code" });
```

### OpenID Connect

Autenticação usando OpenID Connect (camada sobre OAuth 2.0).

#### Características

- ✅ ID Token JWT
- ✅ Discovery automático de endpoints
- ✅ Validação de ID Token
- ✅ Nonce para proteção contra replay
- ✅ UserInfo endpoint

#### Uso

```typescript
import { OpenIDStrategy } from "@modules/auth";

const openidStrategy = new OpenIDStrategy({
  clientId: "seu-client-id",
  clientSecret: "seu-client-secret",
  redirectUri: "http://localhost:3000/auth/openid/callback",
  discoveryUrl:
    "https://seu-dominio.auth0.com/.well-known/openid-configuration",
  scope: ["openid", "profile", "email"],
});

// Obter URL de autorização
const authUrl = openidStrategy.getAuthorizationUrl("state", "nonce");

// Validar código de autorização
const user = await openidStrategy.validate({
  code: "auth-code",
  nonce: "nonce",
});
```

## 🛡️ Guards

### JwtAuthGuard

Protege rotas exigindo um token JWT válido.

```typescript
import { Controller, Get } from "@core/http";
import { JwtAuthGuard } from "@modules/auth";

@Controller("protected")
class ProtectedController {
  constructor(private readonly jwtGuard: JwtAuthGuard) {}

  @Get("/")
  async index(context: any) {
    // Verificar autenticação
    await this.jwtGuard.canActivate(context);

    // Usuário disponível em context.user
    return { user: context.user };
  }
}
```

### RolesGuard

Protege rotas exigindo roles específicas.

```typescript
import { RolesGuard } from '@modules/auth';

const adminGuard = RolesGuard.forRoles(['admin']);

@Get('/admin')
async adminOnly(context: any) {
  await adminGuard.canActivate(context);
  return { message: 'Área administrativa' };
}
```

## 📖 Uso Básico

### 1. Login no seu backend (email/senha)

O SDK **não expõe** POST /auth/login. Você implementa a rota no seu backend, busca o usuário, valida a senha e gera o token:

```typescript
import { Controller, Post } from "@core/http";
import { AuthService } from "@modules/auth";
import { BadRequestException, UnauthorizedException } from "@core/http";

@Controller("users")
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository, // seu repositório
  ) {}

  @Post("/login")
  async login(context: HttpContext) {
    const { email, password } = context.body;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    const valid = await this.authService.comparePassword(
      password,
      user.passwordHash,
    );
    if (!valid) throw new UnauthorizedException("Credenciais inválidas");

    const { passwordHash: _, ...safeUser } = user;
    const tokens = this.authService.generateTokenPair(safeUser);
    return { success: true, data: tokens };
  }
}
```

### 2. Validar Token (SDK)

```typescript
// GET /auth/validate
// Header: Authorization: Bearer <token>

// Resposta
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "roles": ["user"]
    },
    "valid": true
  }
}
```

### 3. Atualizar Token (SDK)

```typescript
// POST /auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Resposta
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer"
  }
}
```

### 4. OAuth com callback no seu backend

No callback OAuth, o SDK troca o `code` pelo usuário do provedor. Se você passar `onOAuthCallback`, o SDK chama essa função para você **encontrar ou criar** o usuário no seu sistema; o token é gerado em cima do usuário que você retornar:

```typescript
AuthModule.forRoot({
  strategies: ["jwt", "oauth"],
  jwt: { secret: process.env.JWT_SECRET!, expiresIn: "1h" },
  oauth: {
    /* ... */
  },
  onOAuthCallback: async (providerUser) => {
    let user = await userRepository.findByEmail(providerUser.email);
    if (!user) {
      user = await userRepository.create({
        email: providerUser.email,
        name: providerUser.username ?? providerUser.email,
        externalId: String(providerUser.id),
      });
    }
    return { id: user.id, email: user.email, roles: user.roles };
  },
});
```

### 5. OAuth Flow (rotas do SDK)

```typescript
// 1. Obter URL de autorização
// GET /auth/oauth/authorize
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?...",
    "state": "random-state"
  }
}

// 2. Redirecionar usuário para a URL
// 3. Callback após autorização
// GET /auth/oauth/callback?code=xxx&state=xxx
{
  "success": true,
  "data": {
    "user": {
      "id": "google-user-id",
      "email": "user@gmail.com",
      "name": "User Name"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### 6. OpenID Connect Flow

```typescript
// 1. Obter URL de autorização
// GET /auth/openid/authorize
{
  "success": true,
  "data": {
    "url": "https://seu-dominio.auth0.com/authorize?...",
    "state": "random-state",
    "nonce": "random-nonce"
  }
}

// 2. Redirecionar usuário para a URL
// 3. Callback após autorização
// GET /auth/openid/callback?code=xxx&state=xxx
{
  "success": true,
  "data": {
    "user": {
      "id": "auth0-user-id",
      "email": "user@example.com",
      "name": "User Name",
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

## 💡 Exemplos

### Proteger Rota com JWT

```typescript
import { Controller, Get } from "@core/http";
import { JwtAuthGuard } from "@modules/auth";

@Controller("users")
class UserController {
  constructor(private readonly jwtGuard: JwtAuthGuard) {}

  @Get("/")
  async list(context: any) {
    // Validar autenticação
    await this.jwtGuard.canActivate(context);

    // Usuário autenticado disponível
    const user = context.user;

    return {
      message: "Lista de usuários",
      user,
    };
  }
}
```

### Proteger Rota com Roles

```typescript
import { RolesGuard, JwtAuthGuard } from "@modules/auth";

@Controller("admin")
class AdminController {
  constructor(
    private readonly jwtGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {
    this.rolesGuard.setRequiredRoles(["admin"]);
  }

  @Get("/")
  async dashboard(context: any) {
    // Validar autenticação
    await this.jwtGuard.canActivate(context);

    // Validar roles
    await this.rolesGuard.canActivate(context);

    return { message: "Dashboard administrativo" };
  }
}
```

### Implementar Registro de Usuário

```typescript
import { AuthService } from "@modules/auth";
import { Injectable } from "@core/di/container-decorator";

@Injectable()
class UserService {
  constructor(private readonly authService: AuthService) {}

  async register(email: string, password: string) {
    // Hash da senha
    const hashedPassword = await this.authService.hashPassword(password);

    // Salvar no banco de dados
    const user = await this.saveToDatabase({
      email,
      password: hashedPassword,
    });

    // Gerar tokens
    const tokens = this.authService["jwtStrategy"].generateTokenPair(user);

    return { user, tokens };
  }

  private async saveToDatabase(data: any) {
    // Implementar lógica de salvamento
    return { id: "123", ...data };
  }
}
```

## 📚 API Reference

### AuthService

#### `loginWithCredentials(email, password, userValidator)`

Autentica usuário com email e senha.

#### `loginWithOAuth(code, state?)`

Autentica usuário via OAuth 2.0.

#### `loginWithOpenID(code, state?, nonce?)`

Autentica usuário via OpenID Connect.

#### `validateToken(token)`

Valida um token JWT.

#### `refreshAccessToken(refreshToken)`

Atualiza o access token usando refresh token.

#### `hashPassword(password, rounds?)`

Gera hash de senha com bcrypt.

#### `comparePassword(password, hash)`

Compara senha com hash.

#### `getOAuthAuthorizationUrl(state?)`

Obtém URL de autorização OAuth.

#### `getOpenIDAuthorizationUrl(state?, nonce?)`

Obtém URL de autorização OpenID.

### JwtStrategy

#### `sign(user)`

Gera token JWT para usuário.

#### `generateTokenPair(user)`

Gera access token e refresh token.

#### `validate(credentials)`

Valida token JWT.

#### `decode(token)`

Decodifica token sem validar.

#### `isExpired(token)`

Verifica se token está expirado.

### Guards

#### `JwtAuthGuard.canActivate(context)`

Valida autenticação JWT.

#### `RolesGuard.canActivate(context)`

Valida roles do usuário.

## 🔒 Segurança

### Boas Práticas

1. **JWT Secret**: Use um secret forte e único em produção
2. **HTTPS**: Sempre use HTTPS em produção
3. **Token Expiration**: Configure expiração adequada (1h para access, 7d para refresh)
4. **Password Hashing**: Use bcrypt com pelo menos 10 rounds
5. **State/Nonce**: Sempre use state e nonce em OAuth/OpenID
6. **Validação**: Valide todos os inputs (DTOs)
7. **Rate Limiting**: Implemente rate limiting em endpoints de auth

### Configuração Recomendada

```env
# Produção
JWT_SECRET=<secret-gerado-aleatoriamente-64-caracteres>
JWT_EXPIRES_IN=1h
NODE_ENV=production
```

## 🐛 Troubleshooting

### Token Inválido

- Verifique se o secret está correto
- Verifique se o token não está expirado
- Verifique o formato do header Authorization

### OAuth Callback Falha

- Verifique se o redirect_uri está correto
- Verifique as credenciais do OAuth provider
- Verifique se o state corresponde

### OpenID Discovery Falha

- Verifique se a discovery URL está correta
- Verifique conectividade com o provider
- Verifique se o issuer está configurado

## 📝 Licença

ISC

## 👤 Autor

Diogo Franco <diogo.franco85@gmail.com>
