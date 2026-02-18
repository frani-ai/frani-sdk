# 🔐 Módulo de Autenticação

Módulo completo de autenticação com suporte a **JWT**, **OAuth 2.0** e **OpenID Connect**.

## 📦 Estrutura

```
auth/
├── strategies/
│   ├── jwt.strategy.ts       # Estratégia JWT
│   ├── oauth.strategy.ts     # Estratégia OAuth 2.0
│   └── openid.strategy.ts    # Estratégia OpenID Connect
├── guards/
│   ├── jwt-auth.guard.ts     # Guard de autenticação JWT
│   └── roles.guard.ts        # Guard de autorização por roles
├── dto/
│   └── login.dto.ts          # DTOs de autenticação
├── interfaces/
│   └── auth.interface.ts     # Interfaces e tipos
├── auth.service.ts           # Serviço principal
├── auth.controller.ts        # Controller com endpoints
├── auth.module.ts            # Módulo
└── index.ts                  # Exports
```

## 🚀 Início Rápido

### 1. Configurar variáveis de ambiente

```env
JWT_SECRET=seu-secret-aqui
JWT_EXPIRES_IN=1h
```

### 2. Registrar o módulo

```typescript
import { HttpServer } from "@core/http";
import { AuthModule } from "@modules/auth";

const app = new HttpServer(3000);
app.registerModule(AuthModule);
app.listen();
```

### 3. Usar nos controllers

```typescript
import { JwtAuthGuard } from "@modules/auth";

@Controller("protected")
class ProtectedController {
  constructor(private readonly jwtGuard: JwtAuthGuard) {}

  @Get("/")
  async index(context: any) {
    await this.jwtGuard.canActivate(context);
    return { user: context.user };
  }
}
```

## 📚 Endpoints Disponíveis

- `POST /auth/login` - Login com credenciais
- `POST /auth/refresh` - Atualizar token
- `GET /auth/validate` - Validar token
- `GET /auth/me` - Dados do usuário autenticado
- `GET /auth/oauth/authorize` - URL de autorização OAuth
- `GET /auth/oauth/callback` - Callback OAuth
- `GET /auth/openid/authorize` - URL de autorização OpenID
- `GET /auth/openid/callback` - Callback OpenID

## 📖 Documentação Completa

Consulte [docs/AUTH.md](../../../docs/AUTH.md) para documentação detalhada.

## 🔑 Estratégias

### JWT

- Autenticação stateless
- Access e refresh tokens
- Configurável

### OAuth 2.0

- Integração com provedores externos
- Google, Facebook, GitHub, etc.
- CSRF protection

### OpenID Connect

- Camada sobre OAuth 2.0
- ID Token JWT
- Discovery automático

## 🛡️ Guards

### JwtAuthGuard

Protege rotas exigindo token JWT válido.

### RolesGuard

Protege rotas exigindo roles específicas.

## 💡 Exemplo

```typescript
// Login
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "senha123",
  }),
});

const { accessToken } = await response.json();

// Usar token
const protected = await fetch("http://localhost:3000/protected", {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

## 🔒 Segurança

- ✅ Bcrypt para hashing de senhas
- ✅ JWT com expiração configurável
- ✅ State/Nonce para OAuth/OpenID
- ✅ Validação de inputs com DTOs
- ✅ Guards para proteção de rotas

## 📝 Licença

ISC
